import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/Components/ui/sheet";
import { Button } from "@/Components/ui/button";

export default function SheetForm({
    open,
    onClose,
    title,
    onSave,
    saving,
    children,
}) {
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[480px] flex flex-col gap-0 overflow-visible">
                <SheetHeader className="pb-4 border-b border-border">
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6 space-y-4">
                    {children}
                </div>

                <SheetFooter className="pt-4 border-t border-border">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onSave} disabled={saving}>
                        {saving
                            ? "Saving..."
                            : title.startsWith("Edit")
                              ? "Update"
                              : "Create"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
