export interface PermitType {
    id: string;
    label: string;
    color: {
        default: string;
        foreground: string;
    };
    description?: string;
}

export const permitTypes: PermitType[] = [
    {
        id: "green",
        label: "Student",
        color: {
            default: "rgb(34, 197, 94, 0.9)",
            foreground: "#ffffff"
        },
        description: "For student commuters"
    },
    {
        id: "red",
        label: "Resident",
        color: {
            default: "rgb(239, 68, 68, 0.9)", 
            foreground: "#ffffff"
        },
        description: "For campus residents"
    },
    {
        id: "orange",
        label: "Staff",
        color: {
            default: "rgb(249, 115, 22, 0.9)",
            foreground: "#ffffff"
        },
        description: "For university staff"
    },
    {
        id: "day pass",
        label: "Visitor",
        color: {
            default: "rgb(147, 51, 234, 0.9)",
            foreground: "#ffffff"
        },
        description: "For campus visitors"
    },
    {
        id: "brown",
        label: "Brown",
        color: {
            default: "rgb(139, 69, 19, 0.9)",
            foreground: "#ffffff"
        },
        description: "Students living in Brown dorms"
    },
    {
        id: "blue",
        label: "Blue",
        color: {
            default: "rgb(29, 78, 216, 0.9)",
            foreground: "#ffffff"
        },
        description: "Faculty and staff members"
    },
    {
        id: "gold",
        label: "Gold",
        color: {
            default: "rgb(255, 215, 0, 0.9)",
            foreground: "#000000"
        },
        description: "For gold permit holders"
    },
    {
        id: "silver",
        label: "Silver",
        color: {
            default: "rgb(190, 190, 190, 0.9)",
            foreground: "#000000"
        },
        description: "For silver permit holders"
    },
    {
        id: "meter",
        label: "Meter",
        color: {
            default: "rgb(0, 100, 0, 0.9)",
            foreground: "#ffffff"
        },
        description: "Metered parking spots"
    }

];

export const gamePermits = [
    {
        id: "Public General",
        label: "Public General",
        color: {
            default: "#006400",  // Dark Green
            foreground: "#FFFFFF"
        },
        description: "Public general parking"
    },
    {
        id: "Booster",
        label: "Booster",
        color: {
            default: "#4B0082",  // Deep Purple
            foreground: "#FFFFFF"
        },
        description: "Booster parking"
    },
];