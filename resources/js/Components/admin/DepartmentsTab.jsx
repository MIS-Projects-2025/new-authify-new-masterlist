import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import { Switch } from "@/Components/ui/switch";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminDepartments } from "@/hooks/useAdminPortal";
import {
    COLOR_OPTIONS,
    COLOR_DOT,
    COLOR_LABEL,
} from "@/constants/portalConstants";
import { getLucideIcon } from "@/utils/getLucideIcon";
import EmptyState from "./shared/EmptyState";
import DeleteDialog from "./shared/DeleteDialog";
import SheetForm from "./shared/SheetForm";
import IconPicker from "./shared/IconPicker";
import Field from "./shared/Field";
import { ActiveBadge } from "./shared/StatusBadge";

const EMPTY_FORM = {
    name: "",
    basename: "",
    color_key: "teal",
    icon: "building-2",
    sort_order: 0,
    is_active: true,
};

export default function DepartmentsTab() {
    const { departments, loading, create, update, remove } =
        useAdminDepartments();
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    function openCreate() {
        setEditing(null);
        setForm(EMPTY_FORM);
        setSheetOpen(true);
    }

    function openEdit(dept) {
        setEditing(dept);
        setForm({
            name: dept.name,
            basename: dept.basename,
            color_key: dept.color_key,
            icon: dept.icon,
            sort_order: dept.sort_order,
            is_active: !!dept.is_active,
        });
        setSheetOpen(true);
    }

    async function handleSave() {
        setSaving(true);
        try {
            editing ? await update(editing.id, form) : await create(form);
            setSheetOpen(false);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        await remove(deleteTarget.id);
        setDeleteTarget(null);
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button size="sm" onClick={openCreate}>
                    <Plus className="w-4 h-4 mr-1" /> Add Department
                </Button>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-14 rounded-lg" />
                    ))}
                </div>
            ) : departments.length === 0 ? (
                <EmptyState label="No departments yet. Add one to get started." />
            ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                {[
                                    "Department",
                                    "Basename",
                                    "Color",
                                    "Icon",
                                    "Order",
                                    "Status",
                                    "",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-4 py-2.5 text-xs font-medium"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((dept) => (
                                <tr
                                    key={dept.id}
                                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {dept.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                                        {dept.basename}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={cn(
                                                    "w-3 h-3 rounded-full",
                                                    COLOR_DOT[dept.color_key],
                                                )}
                                            />
                                            <span className="text-xs text-muted-foreground capitalize">
                                                {dept.color_key}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            {getLucideIcon(
                                                dept.icon,
                                                "w-4 h-4",
                                            )}
                                            <span className="text-xs font-mono">
                                                {dept.icon}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">
                                        {dept.sort_order}
                                    </td>
                                    <td className="px-4 py-3">
                                        <ActiveBadge
                                            isActive={dept.is_active}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => openEdit(dept)}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    setDeleteTarget(dept)
                                                }
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <SheetForm
                open={sheetOpen}
                onClose={() => setSheetOpen(false)}
                title={editing ? "Edit Department" : "Add Department"}
                onSave={handleSave}
                saving={saving}
            >
                <Field label="Department name">
                    <Input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Human Resource"
                    />
                </Field>
                <Field label="Basename (URL key)">
                    <Input
                        value={form.basename}
                        onChange={(e) =>
                            set(
                                "basename",
                                e.target.value
                                    .toLowerCase()
                                    .replace(/\s+/g, "-"),
                            )
                        }
                        placeholder="e.g. hr"
                        className="font-mono"
                    />
                </Field>
                <Field label="Color">
                    <Select
                        value={form.color_key}
                        onValueChange={(v) => set("color_key", v)}
                    >
                        <SelectTrigger>
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "w-3 h-3 rounded-full flex-shrink-0",
                                            COLOR_DOT[form.color_key],
                                        )}
                                    />
                                    <span className="capitalize">
                                        {COLOR_LABEL[form.color_key]}
                                    </span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            sideOffset={4}
                            className="z-[9999] bg-background text-foreground border shadow-lg opacity-100"
                        >
                            {COLOR_OPTIONS.map((c) => (
                                <SelectItem
                                    key={c.value}
                                    value={c.value}
                                    className="bg-background hover:bg-muted focus:bg-muted"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "w-3 h-3 rounded-full flex-shrink-0",
                                                COLOR_DOT[c.value],
                                            )}
                                        />
                                        <span>{c.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <IconPicker
                    value={form.icon}
                    onChange={(v) => set("icon", v)}
                />
                <Field label="Sort order">
                    <Input
                        type="number"
                        value={form.sort_order}
                        onChange={(e) =>
                            set("sort_order", Number(e.target.value))
                        }
                    />
                </Field>
                <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">
                        Active
                    </Label>
                    <Switch
                        checked={form.is_active}
                        onCheckedChange={(v) => set("is_active", v)}
                    />
                </div>
            </SheetForm>

            <DeleteDialog
                open={!!deleteTarget}
                label={deleteTarget?.name}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </>
    );
}
