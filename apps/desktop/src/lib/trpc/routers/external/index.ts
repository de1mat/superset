import { settings } from "@superset/local-db";
import { TRPCError } from "@trpc/server";
import { clipboard, shell } from "electron";
import { localDb } from "main/lib/local-db";
import { z } from "zod";
import { publicProcedure, router } from "../..";
import {
	EXTERNAL_APPS,
	type ExternalApp,
	getAppCandidates,
	resolvePath,
	spawnAsync,
} from "./helpers";

const ExternalAppSchema = z.enum(EXTERNAL_APPS);

async function openPathInApp(
	filePath: string,
	app: ExternalApp,
): Promise<void> {
	if (app === "finder") {
		shell.showItemInFolder(filePath);
		return;
	}

	const candidates = getAppCandidates(app, filePath);
	if (candidates.length === 0) {
		await shell.openPath(filePath);
		return;
	}

	// Try each candidate in order, falling back only when the app is not found.
	// Re-throw immediately for other errors (bad path, permissions, etc.)
	let lastError: Error | undefined;
	for (const cmd of candidates) {
		try {
			await spawnAsync(cmd.command, cmd.args);
			return;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			const msg = lastError.message.toLowerCase();
			const isAppNotFound = msg.includes("unable to find application");
			if (!isAppNotFound) {
				throw lastError;
			}
		}
	}

	if (lastError) {
		throw lastError;
	}
}

/**
 * External operations router.
 * Handles opening URLs and files in external applications.
 */
export const createExternalRouter = () => {
	return router({
		openUrl: publicProcedure.input(z.string()).mutation(async ({ input }) => {
			try {
				await shell.openExternal(input);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";
				console.error("[external/openUrl] Failed to open URL:", input, error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: errorMessage,
				});
			}
		}),

		openInFinder: publicProcedure
			.input(z.string())
			.mutation(async ({ input }) => {
				shell.showItemInFolder(input);
			}),

		openInApp: publicProcedure
			.input(
				z.object({
					path: z.string(),
					app: ExternalAppSchema,
				}),
			)
			.mutation(async ({ input }) => {
				localDb
					.insert(settings)
					.values({ id: 1, lastUsedApp: input.app })
					.onConflictDoUpdate({
						target: settings.id,
						set: { lastUsedApp: input.app },
					})
					.run();
				await openPathInApp(input.path, input.app);
			}),

		copyPath: publicProcedure.input(z.string()).mutation(async ({ input }) => {
			clipboard.writeText(input);
		}),

		openFileInEditor: publicProcedure
			.input(
				z.object({
					path: z.string(),
					line: z.number().optional(),
					column: z.number().optional(),
					cwd: z.string().optional(),
				}),
			)
			.mutation(async ({ input }) => {
				const filePath = resolvePath(input.path, input.cwd);
				const settingsRow = localDb.select().from(settings).get();
				const app = settingsRow?.lastUsedApp ?? "cursor";
				await openPathInApp(filePath, app);
			}),
	});
};

export type ExternalRouter = ReturnType<typeof createExternalRouter>;
