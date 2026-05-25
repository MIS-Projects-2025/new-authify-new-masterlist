import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";
import {
    SYSTEM_STATUS,
    ACTIVE_STATUS,
    AUTO_LOGIN_STATUS,
} from "@/constants/portalConstants";
import { getLucideIcon } from "@/utils/getLucideIcon";

export function SystemStatusBadge({ status }) {
    const s = SYSTEM_STATUS[Number(status)] ?? SYSTEM_STATUS[0];
    return (
        <Badge
            variant="outline"
            className={cn("text-[10px] flex items-center gap-1 w-fit", s.color)}
        >
            {getLucideIcon(s.icon, "w-3 h-3")}
            {s.label}
        </Badge>
    );
}

export function ActiveBadge({ isActive }) {
    const s = ACTIVE_STATUS[!!isActive];
    return (
        <Badge variant="outline" className={cn("text-[10px]", s.color)}>
            {s.label}
        </Badge>
    );
}

export function AutoLoginBadge({ value }) {
    const s = AUTO_LOGIN_STATUS[!!value];
    return (
        <Badge variant="outline" className={cn("text-[10px]", s.color)}>
            {s.label}
        </Badge>
    );
}
