export interface PermitType {
    id: string;
    label: string;
    color: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
    description?: string;
}

export const permitTypes: PermitType[] = [
    {
        id: "green",
        label: "Student",
        color: "success",
        description: "For daily commuters"
    },
    {
        id: "red",
        label: "Resident",
        color: "danger",
        description: "For campus residents"
    },
    {
        id: "orange",
        label: "Staff",
        color: "warning",
        description: "For university staff"
    },
    {
        id: "purple",
        label: "Visitor",
        color: "secondary",
        description: "For campus visitors"
    },
];