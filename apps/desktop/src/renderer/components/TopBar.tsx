import { Button } from "./ui/button";

interface TopBarProps {
	isSidebarOpen: boolean;
	onOpenSidebar: () => void;
}

export function TopBar({ isSidebarOpen, onOpenSidebar }: TopBarProps) {
	return (
		<div
			className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 text-neutral-300 select-none"
			style={{ height: "48px", WebkitAppRegion: "drag" } as React.CSSProperties}
		>
			{/* Left section - Sidebar toggle */}
			<div
				className="flex items-center"
				style={{ paddingLeft: isSidebarOpen ? "1rem" : "88px", WebkitAppRegion: "no-drag" } as React.CSSProperties}
			>
				{!isSidebarOpen && (
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onOpenSidebar}
						className="hover:bg-neutral-800"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M2 4H14M2 8H14M2 12H14"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
						</svg>
					</Button>
				)}
			</div>

			{/* Center section - Search/Address bar */}
			<div className="flex-1 max-w-2xl mx-4" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
				<div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 rounded-lg border border-neutral-800">
					<svg
						width="14"
						height="14"
						viewBox="0 0 14 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="opacity-50"
					>
						<circle
							cx="6"
							cy="6"
							r="4"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<path
							d="M9 9L12 12"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
					<input
						type="text"
						placeholder="Search or enter command..."
						className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-neutral-500"
					/>
				</div>
			</div>

			{/* Right section - Actions */}
			<div className="flex items-center gap-1 pr-4" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
				<Button variant="ghost" size="icon-sm" className="hover:bg-neutral-800">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M8 3V8M8 8V13M8 8H13M8 8H3"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</Button>
				<Button variant="ghost" size="icon-sm" className="hover:bg-neutral-800">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="8" cy="8" r="1.5" fill="currentColor" />
						<circle cx="8" cy="3" r="1.5" fill="currentColor" />
						<circle cx="8" cy="13" r="1.5" fill="currentColor" />
					</svg>
				</Button>
			</div>
		</div>
	);
}
