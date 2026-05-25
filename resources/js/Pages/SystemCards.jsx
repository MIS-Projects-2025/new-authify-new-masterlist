import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { ExternalLink, ChevronRight } from "lucide-react";
import { useCards, useSystems, useDepartments } from "@/hooks/usePortal";
import { usePage } from "@inertiajs/react";

const colorMap = {
    green: {
        card: "border-green-500/20 hover:border-green-500/40",
        accent: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    blue: {
        card: "border-blue-500/20 hover:border-blue-500/40",
        accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    amber: {
        card: "border-amber-500/20 hover:border-amber-500/40",
        accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    red: {
        card: "border-red-500/20 hover:border-red-500/40",
        accent: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    teal: {
        card: "border-teal-500/20 hover:border-teal-500/40",
        accent: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
    violet: {
        card: "border-violet-500/20 hover:border-violet-500/40",
        accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    orange: {
        card: "border-orange-500/20 hover:border-orange-500/40",
        accent: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    neutral: {
        card: "border-border hover:border-border/80",
        accent: "bg-muted text-muted-foreground",
    },
    pink: {
        card: "border-pink-500/20 hover:border-pink-500/40",
        accent: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    },
};

const statusLabel = { 1: "Live", 2: "Parallel Run", 0: "Inactive" };
const statusColor = {
    1: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    2: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    0: "bg-muted text-muted-foreground border-border",
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

export default function SystemCards() {
    const basename =
        new URLSearchParams(window.location.search).get("dept") || "";
    const { departments } = useDepartments();
    const { cards, loading: cardsLoading } = useCards(basename);
    const [openCard, setOpenCard] = useState(null);
    const { systems, loading: systemsLoading } = useSystems(openCard?.id);
    const { emp_data } = usePage().props;
    const dept = departments.find((d) => d.basename === basename);
    const colors = colorMap[dept?.color_key] ?? colorMap.neutral;
    console.log(usePage().props);

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">
                            {dept?.name ?? "Select a department"}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {cards.length}{" "}
                            {cards.length === 1 ? "category" : "categories"}{" "}
                            available
                        </p>
                    </div>
                    {dept && (
                        <div
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
                                colors.accent,
                            )}
                        >
                            {getLucideIcon(dept.icon, "w-3.5 h-3.5")}
                            <span>{dept.name}</span>
                        </div>
                    )}
                </div>

                {/* ── Cards Grid ── */}
                {cardsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-40 rounded-xl" />
                        ))}
                    </div>
                ) : cards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                        <LucideIcons.LayoutGrid className="w-10 h-10 mb-3 opacity-40" />
                        <p className="text-sm">
                            No categories found for this department.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {cards.map((card) => (
                            <button
                                key={card.id}
                                onClick={() => setOpenCard(card)}
                                className={cn(
                                    "group relative text-left p-5 rounded-xl border bg-card",
                                    "hover:bg-accent/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                                    colors.card,
                                )}
                            >
                                {/* Icon badge */}
                                <div
                                    className={cn(
                                        "w-9 h-9 rounded-lg flex items-center justify-center mb-4",
                                        colors.accent,
                                    )}
                                >
                                    {getLucideIcon(card.card_icon, "w-4 h-4")}
                                </div>

                                {/* Title */}
                                <p className="text-sm font-semibold text-card-foreground leading-snug">
                                    {card.card_title}
                                </p>

                                {/* Description */}
                                {card.description && (
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                                        {card.description}
                                    </p>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                                    <span className="text-xs text-muted-foreground">
                                        View systems
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Modal ── */}
            <Dialog open={!!openCard} onOpenChange={() => setOpenCard(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                                    colors.accent,
                                )}
                            >
                                {openCard &&
                                    getLucideIcon(
                                        openCard.card_icon,
                                        "w-4 h-4",
                                    )}
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-semibold text-foreground">
                                    {openCard?.card_title}
                                </DialogTitle>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {systemsLoading
                                        ? "Loading..."
                                        : `${systems.length} systems available`}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col gap-1.5 mt-2">
                        {systemsLoading ? (
                            [...Array(3)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-[60px] rounded-lg"
                                />
                            ))
                        ) : systems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <LucideIcons.ServerOff className="w-8 h-8 mb-2 opacity-40" />
                                <p className="text-xs">No systems available.</p>
                            </div>
                        ) : (
                            systems.map((system) => (
                                <button
                                    key={system.id}
                                    onClick={() =>
                                        window.open(system.system_url, "_blank")
                                    }
                                    className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/40 hover:border-border/80 transition-all duration-150 text-left w-full"
                                >
                                    {/* System icon */}
                                    <div
                                        className={cn(
                                            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                                            "bg-muted text-muted-foreground group-hover:text-foreground transition-colors",
                                        )}
                                    >
                                        {getLucideIcon(
                                            system.modal_icon,
                                            "w-4 h-4",
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {system.list_name}
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[10px] mt-1 px-1.5 py-0 h-4 border font-normal",
                                                statusColor[
                                                    Number(system.system_status)
                                                ],
                                            )}
                                        >
                                            {
                                                statusLabel[
                                                    Number(system.system_status)
                                                ]
                                            }
                                        </Badge>
                                    </div>

                                    {/* Arrow */}
                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground flex-shrink-0 transition-colors" />
                                </button>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
