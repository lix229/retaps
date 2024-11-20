"use client";

import React from "react";
import { Avatar, Badge } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import type { DepartData, Location } from "@/types/locations";
import { CalendarDate, Time } from "@internationalized/date";
export type UpcomingItem = {
    id: string;
    title: string;
    date: string;
    location: Location;
    isEvent: boolean;
    time?: {
        hour: number;
        minute: number;
    };
};

// export type UpcomingItemProps = React.HTMLAttributes<HTMLDivElement> & UpcomingItem;

interface UpcomingItemProps extends UpcomingItem {
    onUpcomingSelect: (data: DepartData) => void;
    className?: string;
}
function parseDate(dateString: string): CalendarDate {
    const date = new Date(dateString);
    return new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate() + 1
    );
}


function UpcomingItem({ onUpcomingSelect, location, date, time, isEvent, title, className, ...props }: UpcomingItemProps) {
    const handleClick = () => {
        const departData = {
            departure_location: null,
            location: location,
            date: parseDate(date),
            time: time ? new Time(time.hour, time.minute) : null
        };
        onUpcomingSelect(departData);
    };

    const formatTime = (time?: { hour: number; minute: number }) => {
        if (!time) return '';
        const hour = time.hour % 12 || 12;
        const minute = time.minute.toString().padStart(2, '0');
        const period = time.hour >= 12 ? 'PM' : 'AM';
        return `${hour}:${minute} ${period}`;
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "flex gap-3 border-b border-divider px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
                className
            )}
            {...props}
        >
            <div className="flex flex-col gap-2">
                <Avatar
                    icon={
                        isEvent ? (
                            <Icon icon="material-symbols:event" width={24} />
                        ) : (
                            <Icon icon="material-symbols:commute" width={24} />
                        )
                    }
                />
            </div>
            <div className="flex flex-col">
                <p className="text-small font-semibold text-foreground">{title}</p>
                <p className="text-small text-default-500">{location.NAME || location.BLDG_NAME}</p>
                <div className="flex gap-2 text-tiny text-default-400">
                    <time>{date}</time>
                    {time && <time>{formatTime(time)}</time>}
                </div>
            </div>
        </div>
    );
}

export default UpcomingItem;