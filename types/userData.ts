export interface PermitType {
    id: string;
    label: string;
    color: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
    description?: string;
}

export const permitTypes: PermitType[] = [
    {
        id: "student",
        label: "Student",
        color: "success",
        description: "For daily commuters"
    },
    {
        id: "resident",
        label: "Resident",
        color: "danger",
        description: "For campus residents"
    },
    {
        id: "staff",
        label: "Staff",
        color: "warning",
        description: "For university staff"
    },
    {
        id: "visitor",
        label: "Visitor",
        color: "secondary",
        description: "For campus visitors"
    },
];