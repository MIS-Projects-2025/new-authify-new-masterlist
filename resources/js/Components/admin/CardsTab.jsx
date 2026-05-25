import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Skeleton } from "@/Components/ui/skeleton";
import { Switch } from "@/Components/ui/switch";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminCards, useAdminDepartments } from "@/hooks/useAdminPortal";
import { COLOR_DOT } from "@/constants/portalConstants";
import { getLucideIcon } from "@/utils/getLucideIcon";
import EmptyState from "./shared/EmptyState";
import DeleteDialog from "./shared/DeleteDialog";
import SheetForm from "./shared/SheetForm";
import IconPicker from "./shared/IconPicker";
import Field from "./shared/Field";
import { ActiveBadge } from "./shared/StatusBadge";

const EMPTY_FORM = {
    department_id: "",
    card_icon: "layout-grid",
    card_title: "",
    description: "",
    sort_order: 0,
    is_active: true,
};

export default function CardsTab() {
    const { cards, loading, create, update, remove } = useAdminCards();
    const { departments } = useAdminDepartments();
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

    function openEdit(card) {
        setEditing(card);
        setForm({
            department_id: String(card.department_id),
            card_icon: card.card_icon,
            card_title: card.card_title,
            description: card.description ?? "",
            sort_order: card.sort_order,
            is_active: !!card.is_active,
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
                    <Plus className="w-4 h-4 mr-1" /> Add Card
                </Button>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-14 rounded-lg" />
                    ))}
                </div>
            ) : cards.length === 0 ? (
                <EmptyState label="No cards yet. Add one to get started." />
            ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                {[
                                    "Title",
                                    "Department",
                                    "Icon",
                                    "Description",
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
                            {cards.map((card) => (
                                <tr
                                    key={card.id}
                                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {card.card_title}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                        {card.department?.name ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            {getLucideIcon(
                                                card.card_icon,
                                                "w-4 h-4",
                                            )}
                                            <span className="text-xs font-mono">
                                                {card.card_icon}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                                        {card.description || "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <ActiveBadge
                                            isActive={card.is_active}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => openEdit(card)}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    setDeleteTarget(card)
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
                title={editing ? "Edit Card" : "Add Card"}
                onSave={handleSave}
                saving={saving}
            >
                <Field label="Department">
                    <Select
                        value={form.department_id}
                        onValueChange={(v) => set("department_id", v)}
                    >
                        <SelectTrigger>
                            <SelectValue>
                                {form.department_id ? (
                                    (() => {
                                        const d = departments.find(
                                            (d) =>
                                                String(d.id) ===
                                                form.department_id,
                                        );
                                        return d ? (
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={cn(
                                                        "w-2 h-2 rounded-full flex-shrink-0",
                                                        COLOR_DOT[d.color_key],
                                                    )}
                                                />
                                                <span>{d.name}</span>
                                            </div>
                                        ) : null;
                                    })()
                                ) : (
                                    <span className="text-muted-foreground">
                                        Select department
                                    </span>
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            sideOffset={4}
                            className="z-[9999] bg-background text-foreground border shadow-lg opacity-100"
                        >
                            {departments.map((d) => (
                                <SelectItem
                                    key={d.id}
                                    value={String(d.id)}
                                    className="bg-background hover:bg-muted focus:bg-muted"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "w-2 h-2 rounded-full flex-shrink-0",
                                                COLOR_DOT[d.color_key],
                                            )}
                                        />
                                        <span>{d.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="Card title">
                    <Input
                        value={form.card_title}
                        onChange={(e) => set("card_title", e.target.value)}
                        placeholder="e.g. Employee Relations"
                    />
                </Field>
                <IconPicker
                    value={form.card_icon}
                    onChange={(v) => set("card_icon", v)}
                />
                <Field label="Description (optional)">
                    <Textarea
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="Short description"
                        rows={3}
                    />
                </Field>
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
                label={deleteTarget?.card_title}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </>
    );
}
