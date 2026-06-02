import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { LayoutGrid, ChevronDown } from "lucide-react";
import { useCards, useSystems, useDepartments } from "@/hooks/usePortal";
import { usePage } from "@inertiajs/react";

const colorMap = {
    green: { card: "border-green-500/20 hover:border-green-500/40", accent: "bg-green-500/10 text-green-600 dark:text-green-400" },
    blue: { card: "border-blue-500/20 hover:border-blue-500/40", accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    amber: { card: "border-amber-500/20 hover:border-amber-500/40", accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    red: { card: "border-red-500/20 hover:border-red-500/40", accent: "bg-red-500/10 text-red-600 dark:text-red-400" },
    teal: { card: "border-teal-500/20 hover:border-teal-500/40", accent: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
    violet: { card: "border-violet-500/20 hover:border-violet-500/40", accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    orange: { card: "border-orange-500/20 hover:border-orange-500/40", accent: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
    neutral: { card: "border-border hover:border-border/80", accent: "bg-muted text-muted-foreground" },
    pink: { card: "border-pink-500/20 hover:border-pink-500/40", accent: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
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
    return Icon ? <Icon className={className} /> : <LucideIcons.Box className={className} />;
}

// ── System icon — mobile app style ───────────────────────────────────────────
function SystemButton({ system, accentCls }) {
    return (
        <button
            onClick={() => window.open(system.system_url, "_blank")}
            className="group flex flex-col items-center gap-2 w-16"
        >
            {/* Circle icon */}
            <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity group-hover:opacity-80",
                accentCls,
            )}>
                {getLucideIcon(system.modal_icon, "w-5 h-5")}
            </div>

            {/* Label — wraps freely, no truncation */}
            <span className="text-[11px] text-center text-foreground leading-tight w-full">
                {system.list_name}
            </span>

            {/* Status badge */}
            <Badge
                variant="outline"
                className={cn(
                    "text-[9px] px-1.5 py-0 h-4 border font-normal",
                    statusColor[Number(system.system_status)],
                )}
            >
                {statusLabel[Number(system.system_status)]}
            </Badge>
        </button>
    );
}

// ── Card group row ────────────────────────────────────────────────────────────
function CardGroup({ card, open, onToggle, colors }) {
    const { systems, loading } = useSystems(open ? card.id : null);

    return (
        <div className={cn("rounded-xl border bg-card overflow-hidden transition-colors", colors.card)}>
            {/* Trigger */}
            <button
                onClick={onToggle}
                aria-expanded={open}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-accent/30 transition-colors text-left"
            >
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", colors.accent)}>
                    {getLucideIcon(card.card_icon, "w-4 h-4")}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-card-foreground leading-snug truncate">
                        {card.card_title}
                    </p>
                    {card.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {card.description}
                        </p>
                    )}
                </div>
                <ChevronDown
                    size={14}
                    className={cn(
                        "text-muted-foreground flex-shrink-0 transition-transform duration-200",
                        open && "rotate-180",
                    )}
                    aria-hidden
                />
            </button>

            {/* Expanded systems */}
            {open && (
                <div className="border-t border-border px-4 pb-5 pt-4">
                    {loading ? (
                        <div className="flex flex-wrap gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 w-16">
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <Skeleton className="h-3 w-14 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : systems.length === 0 ? (
                        <div className="flex items-center gap-2 py-1 text-muted-foreground">
                            <LucideIcons.ServerOff className="w-4 h-4 opacity-50" />
                            <span className="text-xs">No systems available.</span>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-x-6 gap-y-5">
                            {systems.map((system) => (
                                <SystemButton
                                    key={system.id}
                                    system={system}
                                    accentCls={colors.accent}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SystemCards() {
    const basename = new URLSearchParams(window.location.search).get("dept") || "";
    const { departments } = useDepartments();
    const { cards, loading: cardsLoading } = useCards(basename);
    const [openMap, setOpenMap] = useState({});

    const dept = departments.find((d) => d.basename === basename);
    const colors = colorMap[dept?.color_key] ?? colorMap.neutral;
    const anyOpen = cards.some((c) => openMap[c.id]);

    function toggle(id) {
        setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    function toggleAll() {
        setOpenMap(
            anyOpen ? {} : Object.fromEntries(cards.map((c) => [c.id, true]))
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">
                            {dept?.name ?? "Select a department"}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {cards.length} {cards.length === 1 ? "category" : "categories"} available
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {dept && (
                            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium", colors.accent)}>
                                {getLucideIcon(dept.icon, "w-3.5 h-3.5")}
                                <span>{dept.name}</span>
                            </div>
                        )}
                        {cards.length > 0 && (
                            <button
                                onClick={toggleAll}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                            >
                                <LayoutGrid size={13} aria-hidden />
                                {anyOpen ? "Collapse all" : "Show all"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Card list */}
                {cardsLoading ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-16 rounded-xl" />
                        ))}
                    </div>
                ) : cards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                        <LucideIcons.LayoutGrid className="w-10 h-10 mb-3 opacity-40" />
                        <p className="text-sm">No categories found for this department.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {cards.map((card) => (
                            <CardGroup
                                key={card.id}
                                card={card}
                                open={!!openMap[card.id]}
                                onToggle={() => toggle(card.id)}
                                colors={colors}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}