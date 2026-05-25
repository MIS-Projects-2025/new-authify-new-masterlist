import { Inbox } from "lucide-react";

export default function EmptyState({ label }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Inbox className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">{label}</p>
        </div>
    );
}
