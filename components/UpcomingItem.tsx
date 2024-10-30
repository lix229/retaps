"use client";

import React from "react";
import { Avatar, Badge } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { cn } from "@nextui-org/react";

export type UpcomingItemType = "event" | "commute";

export type UpcomingItem = {
    id: string;
    title: string;
    date: string;
    location: string;
    isEvent: boolean;
};

export type UpcomingItemProps = React.HTMLAttributes<HTMLDivElement> & UpcomingItem;

const UpcomingItem = React.forwardRef<HTMLDivElement, UpcomingItemProps>(
    ({ title, date, location, isEvent, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex gap-3 border-b border-divider px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700", className)}
                {...props}
            >
                <div className="relative flex-none mt-2">
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
                    <p className="text-small text-default-500">{location}</p>
                    <time className="text-tiny text-default-400">{date}</time>
                </div>
            </div>
        );
    },
);

UpcomingItem.displayName = "UpcomingItem";

export default UpcomingItem;
