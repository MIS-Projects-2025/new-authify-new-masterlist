import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";

// ─── Single Combobox ──────────────────────────────────────────────────────────
// Fully compatible with AntD Form.Item noStyle (value + onChange props).
// Also accepts onFocus for cascading load triggers.

export const Combobox = ({
    options = [],
    value,
    onChange,
    onFocus,
    placeholder = "Select…",
    loading = false,
    disabled = false,
    clearable = true,
    className,
    style,
    allowCustomValue = true, // Add this prop
}) => {
    const [open, setOpen] = useState(false);

    // Find matching option, but if not found, create a temporary option for display
    const matchedOption = options.find(
        (o) => String(o.value) === String(value),
    );
    const selectedLabel = matchedOption?.label ?? (value ? String(value) : "");

    const handleSelect = (optValue) => {
        // Find the actual option by label or value
        const opt = options.find(
            (o) => String(o.label) === optValue || String(o.value) === optValue,
        );
        if (!opt) return;
        onChange?.(opt.value === value ? undefined : opt.value);
        setOpen(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange?.(undefined);
    };

    // Combine options with current value if it doesn't exist and allowCustomValue is true
    const displayOptions =
        allowCustomValue && value && !matchedOption
            ? [...options, { value, label: value }]
            : options;

    return (
        <Popover
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
                if (o) onFocus?.();
            }}
        >
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled || loading}
                    className={cn(
                        "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm",
                        "hover:bg-accent/40 transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        className,
                    )}
                    style={style}
                >
                    <span
                        className={cn(
                            "truncate text-left flex-1",
                            !selectedLabel && "text-muted-foreground",
                        )}
                    >
                        {loading ? "Loading…" : selectedLabel || placeholder}
                    </span>
                    <span className="flex items-center gap-0.5 ml-1 flex-shrink-0">
                        {clearable &&
                            value != null &&
                            value !== "" &&
                            !disabled &&
                            !loading && (
                                <span
                                    role="button"
                                    tabIndex={-1}
                                    className="rounded p-0.5 hover:bg-muted transition-colors"
                                    onClick={handleClear}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </span>
                            )}
                        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    </span>
                </button>
            </PopoverTrigger>

            <PopoverContent
                className={cn(
                    "p-0 w-[var(--radix-popover-trigger-width)] min-w-[160px] shadow-md",
                    "bg-popover text-popover-foreground",
                )}
                align="start"
                sideOffset={4}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onWheel={(e) => e.stopPropagation()}
            >
                <Command>
                    <CommandInput
                        placeholder="Search…"
                        className="h-8 text-sm border-none focus:ring-0"
                    />
                    <CommandList
                        className="max-h-56 overflow-y-auto"
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <CommandEmpty className="py-5 text-center text-xs text-muted-foreground">
                            No results found.
                        </CommandEmpty>
                        <CommandGroup>
                            {displayOptions.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={String(opt.label ?? opt.value)}
                                    onSelect={handleSelect}
                                    className="text-sm cursor-pointer gap-2"
                                >
                                    <Check
                                        className={cn(
                                            "h-3.5 w-3.5 flex-shrink-0 text-primary",
                                            String(value) === String(opt.value)
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {opt.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

// ─── Multi Combobox ───────────────────────────────────────────────────────────

export const MultiCombobox = ({
    options = [],
    value = [],
    onChange,
    onFocus,
    placeholder = "Select…",
    loading = false,
    disabled = false,
    className,
    style,
}) => {
    const [open, setOpen] = useState(false);
    const selected = Array.isArray(value) ? value : [];

    const selectedLabels = selected.map(
        (v) =>
            options.find((o) => String(o.value) === String(v))?.label ??
            String(v),
    );

    const toggle = (optValue) => {
        const next = selected.some((v) => String(v) === String(optValue))
            ? selected.filter((v) => String(v) !== String(optValue))
            : [...selected, optValue];
        onChange?.(next);
    };

    return (
        <Popover
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
                if (o) onFocus?.();
            }}
        >
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled || loading}
                    className={cn(
                        "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm",
                        "hover:bg-accent/40 transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        className,
                    )}
                    style={style}
                >
                    <span className="flex-1 truncate text-left min-w-0">
                        {loading ? (
                            <span className="text-muted-foreground">
                                Loading…
                            </span>
                        ) : selectedLabels.length > 0 ? (
                            <span className="flex gap-1 flex-wrap">
                                {selectedLabels.map((l) => (
                                    <Badge
                                        key={l}
                                        variant="secondary"
                                        className="text-[10px] px-1.5 py-0 h-4 font-normal"
                                    >
                                        {l}
                                    </Badge>
                                ))}
                            </span>
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                    </span>
                    <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0 ml-1" />
                </button>
            </PopoverTrigger>

            <PopoverContent
                className={cn(
                    "p-0 w-[var(--radix-popover-trigger-width)] min-w-[160px] shadow-md",
                    "bg-popover text-popover-foreground",
                )}
                align="start"
                sideOffset={4}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onWheel={(e) => e.stopPropagation()}
            >
                <Command>
                    <CommandInput
                        placeholder="Search…"
                        className="h-8 text-sm border-none focus:ring-0"
                    />
                    <CommandList
                        className="max-h-56 overflow-y-auto"
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <CommandEmpty className="py-5 text-center text-xs text-muted-foreground">
                            No results found.
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((opt) => {
                                const isSelected = selected.some(
                                    (v) => String(v) === String(opt.value),
                                );
                                return (
                                    <CommandItem
                                        key={opt.value}
                                        value={String(opt.label ?? opt.value)}
                                        onSelect={() => toggle(opt.value)}
                                        className="text-sm cursor-pointer gap-2"
                                    >
                                        <Check
                                            className={cn(
                                                "h-3.5 w-3.5 flex-shrink-0 text-primary",
                                                isSelected
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                        {opt.label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
