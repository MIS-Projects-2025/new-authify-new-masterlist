export const COLOR_OPTIONS = [
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
    { value: "amber", label: "Amber" },
    { value: "red", label: "Red" },
    { value: "teal", label: "Teal" },
    { value: "violet", label: "Violet" },
    { value: "orange", label: "Orange" },
    { value: "neutral", label: "Neutral" },
    { value: "pink", label: "Pink" },
];

export const COLOR_LABEL = {
    green: "Green",
    blue: "Blue",
    amber: "Amber",
    red: "Red",
    teal: "Teal",
    violet: "Violet",
    orange: "Orange",
    neutral: "Neutral",
    pink: "Pink",
};
export const COLOR_DOT = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    teal: "bg-teal-500",
    violet: "bg-violet-500",
    orange: "bg-orange-500",
    neutral: "bg-muted-foreground",
    pink: "bg-pink-500",
};

export const SYSTEM_STATUS = {
    0: {
        label: "Inactive",
        color: "bg-muted text-muted-foreground border-border",
        icon: "circle-off",
    },
    1: {
        label: "Live",
        color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
        icon: "circle-check",
    },
    2: {
        label: "Parallel Run",
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: "git-branch",
    },
};

export const ACTIVE_STATUS = {
    true: {
        label: "Active",
        color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    },
    false: {
        label: "Inactive",
        color: "bg-muted text-muted-foreground border-border",
    },
};

export const AUTO_LOGIN_STATUS = {
    true: {
        label: "Yes",
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    false: {
        label: "No",
        color: "bg-muted text-muted-foreground border-border",
    },
};
