import { Input } from "@/Components/ui/input";
import { getLucideIcon } from "@/utils/getLucideIcon";
import Field from "./Field";

export default function IconPicker({ value, onChange }) {
    return (
        <Field label="Icon (Lucide name)">
            <div className="flex gap-2">
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="e.g. building-2"
                    className="font-mono flex-1"
                />
                <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground flex-shrink-0">
                    {getLucideIcon(value, "w-4 h-4")}
                </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
                Find icons at{" "}
                <span className="font-mono">lucide.dev/icons</span>
            </p>
        </Field>
    );
}
