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
import type { UpcomingItemType } from "@/types/upcoming";
import type { DepartData } from "@/types/locations";

enum UpcomingTabs {
    All = "all",
    Commute = "commute",
    Events = "events",
}

const upcomingData: Record<UpcomingTabs, UpcomingItemType[]> = {
    all: [
        {
            id: "1",
            isEvent: false,
            title: "CS Class",
            date: "2024-12-15",
            location: {
                BLDGCODE: "CSE",
                BLDG: "Computer Sciences/Engineering",
                NAME: "Computer Sciences/Engineering",
                ABBREV: "CSE",
                OFFICIAL_ROOM_NAME: "E309",
                LAT: 29.6484,
                LON: -82.3444,
                SITECODE: "0042",
                BLDG_NAME: "Computer Sciences/Engineering"
            },
            time: {
                hour: 10,
                minute: 30
            }
        },
        {
            id: "2",
            isEvent: true,
            title: "Football Game",
            date: "2024-11-25",
            location: {
                BLDGCODE: "BHG",
                BLDG: "Ben Hill Griffin Stadium",
                NAME: "Ben Hill Griffin Stadium",
                ABBREV: "BHG",
                OFFICIAL_ROOM_NAME: "Stadium",
                LAT: 29.6500,
                LON: -82.3486,
                SITECODE: "0157",
                BLDG_NAME: "Ben Hill Griffin Stadium"
            },
            time: {
                hour: 15,
                minute: 0
            }
        },
        {
            id: "3",
            isEvent: false,
            title: "Library Study",
            date: "2024-11-27",
            location: {
                BLDGCODE: "LIB",
                BLDG: "Library West",
                NAME: "Library West",
                ABBREV: "LIB",
                OFFICIAL_ROOM_NAME: "Library",
                LAT: 29.6508,
                LON: -82.3427,
                SITECODE: "0211",
                BLDG_NAME: "Library West"
            },
            time: {
                hour: 19,
                minute: 0
            }
        }
    ],
    events: [
        {
            id: "2",
            isEvent: true,
            title: "Football Game",
            date: "2024-11-25",
            location: {
                BLDGCODE: "BHG",
                BLDG: "Ben Hill Griffin Stadium",
                NAME: "Ben Hill Griffin Stadium",
                ABBREV: "BHG",
                OFFICIAL_ROOM_NAME: "Stadium",
                LAT: 29.6500,
                LON: -82.3486,
                SITECODE: "0157",
                BLDG_NAME: "Ben Hill Griffin Stadium"
            },
            time: {
                hour: 15,
                minute: 0
            }
        },
    ],
    commute: [
        {
            id: "1",
            isEvent: false,
            title: "CS Class",
            date: "2024-12-15",
            location: {
                BLDGCODE: "CSE",
                BLDG: "Computer Sciences/Engineering",
                NAME: "Computer Sciences/Engineering",
                ABBREV: "CSE",
                OFFICIAL_ROOM_NAME: "E309",
                LAT: 29.6484,
                LON: -82.3444,
                SITECODE: "0042",
                BLDG_NAME: "Computer Sciences/Engineering"
            },
            time: {
                hour: 10,
                minute: 30
            }
        },
        {
            id: "3",
            isEvent: false,
            title: "Library Study",
            date: "2024-12-18",
            location: {
                BLDGCODE: "LIB",
                BLDG: "Library West",
                NAME: "Library West",
                ABBREV: "LIB",
                OFFICIAL_ROOM_NAME: "Library",
                LAT: 29.6508,
                LON: -82.3427,
                SITECODE: "0211",
                BLDG_NAME: "Library West"
            },
            time: {
                hour: 19,
                minute: 0
            }
        }
    ]
};
export default function Upcoming({ onUpcomingSelect }: { onUpcomingSelect: (data: DepartData) => void }) {
    const [activeTab, setActiveTab] = React.useState<UpcomingTabs>(UpcomingTabs.All);
    const activeItems = upcomingData[activeTab];

    return (
        <Card className="w-full h-[calc(100vh-250px)]">
            <CardHeader className="flex flex-col px-0 pb-0 z-0 overflow-hidden"> {/* Adjusted z-index */}
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
            <CardBody className="w-full gap-0 p-0 z-0">
                <ScrollShadow className="h-[500px] w-full">
                    {activeItems.length > 0 ? (
                        activeItems.map((item) => (
                            <UpcomingItem
                                key={item.id}
                                {...item}
                                onUpcomingSelect={onUpcomingSelect}
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
            <CardFooter className="justify-end gap-2 px-4 z-10"> {/* Set higher z-index for footer */}
                <Button variant="light">Settings</Button>
                <Button variant="flat">Add Event</Button>
            </CardFooter>
        </Card>
    );
}
