"use client";

import type { CardProps } from "@nextui-org/react";
import React from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Tabs,
    Tab,
    ScrollShadow,
    CardFooter,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import UpcomingItem from "@/components/UpcomingItem";

type UpcomingItem = {
    id: string;
    isEvent: boolean;
    title: string;
    date: string;
    location: string;
};

enum UpcomingTabs {
    All = "all",
    Commute = "commute",
    Events = "events",
}

const upcomingData: Record<UpcomingTabs, UpcomingItem[]> = {
    all: [
        { id: "1", isEvent: true, title: "Team Meeting", date: "Oct 30, 2023", location: "Office" },
        { id: "2", isEvent: false, title: "Commute to Downtown", date: "Nov 1, 2023", location: "Downtown" },
        { id: "3", isEvent: true, title: "Conference", date: "Nov 5, 2023", location: "City Hall" },
        { id: "4", isEvent: false, title: "Commute to Park", date: "Nov 6, 2023", location: "Central Park" },
    ],
    commute: [
        { id: "2", isEvent: false, title: "Commute to Downtown", date: "Nov 1, 2023", location: "Downtown" },
        { id: "4", isEvent: false, title: "Commute to Park", date: "Nov 6, 2023", location: "Central Park" },
    ],
    events: [
        { id: "1", isEvent: true, title: "Team Meeting", date: "Oct 30, 2023", location: "Office" },
        { id: "3", isEvent: true, title: "Conference", date: "Nov 5, 2023", location: "City Hall" },
    ],
};

export default function Component(props: CardProps) {
    const [activeTab, setActiveTab] = React.useState<UpcomingTabs>(UpcomingTabs.All);
    const activeItems = upcomingData[activeTab];

    return (
        <Card className="w-full h-[calc(100vh-250px)]" {...props}>
            <CardHeader className="flex flex-col px-0 pb-0">
                <div className="flex w-full items-center justify-between px-5 py-2">
                    <div className="inline-flex items-center gap-1">
                        <h4 className="inline-block align-middle text-large font-medium">Upcoming</h4>
                        <Chip size="sm" variant="flat">
                            {upcomingData.all.length}
                        </Chip>
                    </div>
                    <Button className="h-8 px-3" color="primary" radius="full" variant="light">
                        View Calendar
                    </Button>
                </div>
                <Tabs
                    aria-label="Upcoming"
                    classNames={{
                        base: "w-full",
                        tabList: "gap-6 px-6 py-0 w-full relative rounded-none border-b border-divider",
                        cursor: "w-full",
                        tab: "max-w-fit px-2 h-12",
                    }}
                    color="primary"
                    selectedKey={activeTab}
                    variant="underlined"
                    onSelectionChange={(selected) => setActiveTab(selected as UpcomingTabs)}
                >
                    <Tab
                        key="all"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>All</span>
                                <Chip size="sm" variant="flat">{upcomingData.all.length}</Chip>
                            </div>
                        }
                    />
                    <Tab
                        key="commute"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Commute</span>
                                <Chip size="sm" variant="flat">{upcomingData.commute.length}</Chip>
                            </div>
                        }
                    />
                    <Tab
                        key="events"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Events</span>
                                <Chip size="sm" variant="flat">{upcomingData.events.length}</Chip>
                            </div>
                        }
                    />
                </Tabs>
            </CardHeader>
            <CardBody className="w-full gap-0 p-0">
                <ScrollShadow className="h-[500px] w-full">
                    {activeItems.length > 0 ? (
                        activeItems.map((item) => (
                            <UpcomingItem
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                date={item.date}
                                location={item.location}
                                isEvent={item.isEvent}
                            />
                        ))
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                            <Icon className="text-default-400" icon="solar:calendar-circle-minus" width={40} />
                            <p className="text-small text-default-400">No upcoming items.</p>
                        </div>
                    )}
                </ScrollShadow>
            </CardBody>
            <CardFooter className="justify-end gap-2 px-4">
                <Button variant="light">Settings</Button>
                <Button variant="flat">Add Event</Button>
            </CardFooter>
        </Card>
    );
}
