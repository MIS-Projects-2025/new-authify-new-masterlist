import * as LucideIcons from "lucide-react";

export function getLucideIcon(name, className = "w-4 h-4") {
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
