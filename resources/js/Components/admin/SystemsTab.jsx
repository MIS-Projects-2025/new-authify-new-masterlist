import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Skeleton } from "@/Components/ui/skeleton";
import { Switch } from "@/Components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminSystems, useAdminCards } from "@/hooks/useAdminPortal";
import { getLucideIcon } from "@/utils/getLucideIcon";
import EmptyState from "./shared/EmptyState";
import DeleteDialog from "./shared/DeleteDialog";
import SheetForm from "./shared/SheetForm";
import IconPicker from "./shared/IconPicker";
import Field from "./shared/Field";
import { SystemStatusBadge, AutoLoginBadge } from "./shared/StatusBadge";
import { SYSTEM_STATUS } from "@/constants/portalConstants";

const EMPTY_FORM = {
    card_id: "",
    list_name: "",
    system_url: "",
    modal_icon: "link",
    system_status: 1,
    require_auto_login: false,
    sort_order: 0,
};

export default function SystemsTab() {
    const { systems, loading, create, update, remove } = useAdminSystems();
    const { cards } = useAdminCards();
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

    function openEdit(sys) {
        setEditing(sys);
        setForm({
            card_id: String(sys.card_id),
            list_name: sys.list_name,
            system_url: sys.system_url,
            modal_icon: sys.modal_icon,
            system_status: Number(sys.system_status),
            require_auto_login: !!Number(sys.require_auto_login),
            sort_order: sys.sort_order,
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
                    <Plus className="w-4 h-4 mr-1" /> Add System
                </Button>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-14 rounded-lg" />
                    ))}
                </div>
            ) : systems.length === 0 ? (
                <EmptyState label="No systems yet. Add one to get started." />
            ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                {[
                                    "System name",
                                    "Card",
                                    "URL",
                                    "Status",
                                    "Auto login",
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
                            {systems.map((sys) => (
                                <tr
                                    key={sys.id}
                                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {getLucideIcon(
                                                sys.modal_icon,
                                                "w-4 h-4 text-muted-foreground",
                                            )}
                                            <span className="font-medium text-foreground">
                                                {sys.list_name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                        {sys.card?.card_title ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono max-w-[180px] truncate">
                                        {sys.system_url}
                                    </td>
                                    <td className="px-4 py-3">
                                        <SystemStatusBadge
                                            status={sys.system_status}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <AutoLoginBadge
                                            value={sys.require_auto_login}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => openEdit(sys)}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    setDeleteTarget(sys)
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
                title={editing ? "Edit System" : "Add System"}
                onSave={handleSave}
                saving={saving}
            >
                <Field label="Card">
                    <Select
                        value={form.card_id}
                        onValueChange={(v) => set("card_id", v)}
                    >
                        <SelectTrigger>
                            <SelectValue>
                                {form.card_id ? (
                                    (() => {
                                        const c = cards.find(
                                            (c) =>
                                                String(c.id) === form.card_id,
                                        );
                                        return c ? (
                                            <div className="flex flex-col">
                                                <span>{c.card_title}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {c.department?.name}
                                                </span>
                                            </div>
                                        ) : null;
                                    })()
                                ) : (
                                    <span className="text-muted-foreground">
                                        Select card
                                    </span>
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            sideOffset={4}
                            className="z-[9999] bg-background text-foreground border shadow-lg opacity-100"
                        >
                            {cards.map((c) => (
                                <SelectItem
                                    key={c.id}
                                    value={String(c.id)}
                                    className="bg-background hover:bg-muted focus:bg-muted"
                                >
                                    <div className="flex flex-col">
                                        <span>{c.card_title}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {c.department?.name}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="System name">
                    <Input
                        value={form.list_name}
                        onChange={(e) => set("list_name", e.target.value)}
                        placeholder="e.g. IR & DA"
                    />
                </Field>
                <Field label="System URL">
                    <Input
                        value={form.system_url}
                        onChange={(e) => set("system_url", e.target.value)}
                        placeholder="https://..."
                        className="font-mono text-xs"
                    />
                </Field>
                <IconPicker
                    value={form.modal_icon}
                    onChange={(v) => set("modal_icon", v)}
                />
                <Field label="Status">
                    <Select
                        value={String(form.system_status)}
                        onValueChange={(v) => set("system_status", Number(v))}
                    >
                        <SelectTrigger>
                            <SelectValue>
                                {(() => {
                                    const s = SYSTEM_STATUS[form.system_status];
                                    return s ? (
                                        <div className="flex items-center gap-2">
                                            {getLucideIcon(
                                                s.icon,
                                                "w-3.5 h-3.5",
                                            )}
                                            <span>{s.label}</span>
                                        </div>
                                    ) : null;
                                })()}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            sideOffset={4}
                            className="z-[9999] bg-background text-foreground border shadow-lg opacity-100"
                        >
                            {Object.entries(SYSTEM_STATUS).map(([val, s]) => (
                                <SelectItem
                                    key={val}
                                    value={val}
                                    className="bg-background hover:bg-muted focus:bg-muted"
                                >
                                    <div className="flex items-center gap-2">
                                        {getLucideIcon(s.icon, "w-3.5 h-3.5")}
                                        <span>{s.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                        Require auto login
                    </Label>
                    <Switch
                        checked={form.require_auto_login}
                        onCheckedChange={(v) => set("require_auto_login", v)}
                    />
                </div>
            </SheetForm>

            <DeleteDialog
                open={!!deleteTarget}
                label={deleteTarget?.list_name}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </>
    );
}
