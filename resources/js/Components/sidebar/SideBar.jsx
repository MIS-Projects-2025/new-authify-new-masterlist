import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Navigation from "@/Components/sidebar/Navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    Menu,
    X,
    PanelLeftClose,
    PanelLeftOpen,
    MonitorSmartphone,
} from "lucide-react";

export default function Sidebar() {
    const { display_name, emp_data } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    const formattedAppName = display_name
        ?.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    if (!mounted) return null;

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex">
                {/* ── Mobile Hamburger ── */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed z-[60] top-4 left-4 md:hidden h-9 w-9 bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-sm"
                    onClick={() => setIsMobileSidebarOpen(true)}
                >
                    <Menu className="w-4 h-4" />
                </Button>

                {/* ── Mobile Overlay ── */}
                {isMobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                )}

                {/* ── Sidebar ── */}
                <aside
                    className={cn(
                        "fixed md:relative top-0 left-0 z-50 flex flex-col h-screen",
                        "bg-zinc-950 dark:bg-zinc-950 text-zinc-100",
                        "border-r border-zinc-800/60",
                        "shadow-[4px_0_24px_-4px_rgba(0,0,0,0.4)]",
                        "transition-all duration-300 ease-in-out",
                        isSidebarOpen ? "w-64" : "w-[68px]",
                        isMobileSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0",
                    )}
                >
                    {/* ── Desktop Collapse Toggle ── */}
                    <button
                        className={cn(
                            "hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10",
                            "w-6 h-6 items-center justify-center rounded-full",
                            "bg-zinc-800 text-zinc-400 hover:text-zinc-100",
                            "border border-zinc-700/60 shadow-md",
                            "hover:bg-zinc-700 hover:scale-110",
                            "transition-all duration-200",
                        )}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? (
                            <PanelLeftClose className="w-3 h-3" />
                        ) : (
                            <PanelLeftOpen className="w-3 h-3" />
                        )}
                    </button>

                    {/* ── Mobile Close ── */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 md:hidden h-7 w-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    >
                        <X className="w-4 h-4" />
                    </Button>

                    {/* ── Logo ── */}
                    <div
                        className={cn(
                            "flex items-center h-14 border-b border-zinc-800/60",
                            isSidebarOpen ? "px-4" : "px-0 justify-center",
                        )}
                    >
                        <Link
                            href={route("dashboard")}
                            className={cn(
                                "flex items-center gap-2.5 min-w-0",
                                !isSidebarOpen && "justify-center",
                            )}
                        >
                            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/50">
                                <MonitorSmartphone className="w-4 h-4 text-white" />
                            </div>

                            {isSidebarOpen && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-zinc-100 leading-tight tracking-wide">
                                        {formattedAppName}
                                    </span>
                                    <span className="text-[7px] text-zinc-500 leading-tight font-medium tracking-wider uppercase truncate"></span>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* ── Navigation ── */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 scroll-smooth scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        <Navigation isSidebarOpen={isSidebarOpen} />
                    </div>
                </aside>
            </div>
        </TooltipProvider>
    );
}
