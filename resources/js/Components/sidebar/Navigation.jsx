import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Skeleton } from "@/Components/ui/skeleton";
import { useDepartments } from "@/hooks/usePortal";

const colorMap = {
    green: "bg-green-500/10 text-green-400",
    blue: "bg-blue-500/10 text-blue-400",
    amber: "bg-amber-500/10 text-amber-400",
    red: "bg-red-500/10 text-red-400",
    teal: "bg-teal-500/10 text-teal-400",
    violet: "bg-violet-500/10 text-violet-400",
    orange: "bg-orange-500/10 text-orange-400",
    neutral: "bg-zinc-500/10 text-zinc-400",
    pink: "bg-pink-500/10 text-pink-400",
};

function getLucideIcon(name, className = "w-4 h-4") {
    const formatted = name
        ?.split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
    const Icon = LucideIcons[formatted];
    return Icon ? (
        <Icon className={className} />
    ) : (
        <LucideIcons.Box className={className} />
    );
}

export default function Navigation({ isSidebarOpen }) {
    const { departments, loading } = useDepartments();
    const currentBasename =
        new URLSearchParams(window.location.search).get("dept") || "";

    const { emp_data } = usePage().props;

    if (loading) {
        return (
            <div className="flex flex-col gap-1.5 px-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-9 w-full rounded-lg bg-zinc-800"
                    />
                ))}
            </div>
        );
    }

    return (
        <nav className="flex flex-col h-full px-2">
            {/* 🔹 SCROLLABLE DEPARTMENTS */}
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest px-3 py-2">
                    Departments
                </p>

                {departments.map((dept) => {
                    const isActive = currentBasename === dept.basename;
                    const colorClass = colorMap[dept.color] ?? colorMap.neutral;

                    const content = (
                        <Link
                            key={dept.id}
                            href={route("portal", {
                                dept: dept.basename,
                            })}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group w-full",
                                isActive
                                    ? "bg-zinc-800 text-zinc-100"
                                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100",
                            )}
                        >
                            <span
                                className={cn(
                                    "flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-colors",
                                    isActive
                                        ? colorClass
                                        : "bg-zinc-800/80 text-zinc-500 group-hover:text-zinc-300",
                                )}
                            >
                                {getLucideIcon(dept.icon)}
                            </span>

                            {isSidebarOpen && (
                                <span className="text-sm font-medium truncate leading-none flex-1">
                                    {dept.name}
                                </span>
                            )}

                            {isSidebarOpen && isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                            )}
                        </Link>
                    );

                    return isSidebarOpen ? (
                        <div key={dept.id}>{content}</div>
                    ) : (
                        <Tooltip key={dept.id}>
                            <TooltipTrigger asChild>{content}</TooltipTrigger>
                            <TooltipContent side="right" className="text-xs">
                                {dept.name}
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>

            {/* 🔹 STICKY ADMIN (always visible) */}
            {emp_data?.role === "admin" && (
                <div className="sticky bottom-0 bg-zinc-950 pt-3 pb-2">
                    <div className="border-t border-zinc-800 mb-2" />

                    <Link
                        href={route("admin.portal")}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group w-full",
                            "text-blue-400 hover:bg-blue-500/10 hover:text-blue-300",
                        )}
                    >
                        <span className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-500/10 text-blue-400">
                            {getLucideIcon("shield")}
                        </span>

                        {isSidebarOpen && (
                            <span className="text-sm font-medium truncate leading-none flex-1">
                                Admin Portal
                            </span>
                        )}
                    </Link>
                </div>
            )}
        </nav>
    );
}
