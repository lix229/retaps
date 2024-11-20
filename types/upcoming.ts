import type { Location } from "@/types/locations";

export type UpcomingItemType = {
    id: string;
    isEvent: boolean;
    title: string;
    date: string;
    location: Location; 
    time?: {
        hour: number;
        minute: number;
    };
};