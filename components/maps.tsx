"use client";

import React, { useMemo } from 'react';
import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import { useTheme } from 'next-themes';
import { Select, SelectItem, Selection, Chip } from "@nextui-org/react";


const darkStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

const lightStyles = [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
    }
];
interface PermitType {
    id: string;
    label: string;
    color: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
    description?: string;
}

interface PermitType {
    id: string;
    label: string;
    color: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
    description?: string;
}

const permitTypes: PermitType[] = [
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

export default function MapComponent() {
    const { theme } = useTheme();
    const [selectedPermits, setSelectedPermits] = React.useState<Selection>(new Set([]));



    const renderSelectedItems = (items: any) => {
        return (
            <div className="flex flex-wrap gap-1">
                {items.map((item: any) => (
                    <Chip
                        key={item.key}
                        color={permitTypes.find(p => p.id === item.key)?.color || "default"}
                        variant="flat"
                        size="sm"
                        className='mt-4'
                    >
                        {item.textValue}
                    </Chip>
                ))}
            </div>
        );
    };

    return (
        <APIProvider apiKey={process.env.MAPS_API_KEY!}>
            <div className="w-full h-full rounded-lg overflow-hidden shadow-lg bg-red-200 relative">
                <Select
                    size="sm"
                    placeholder="Select Permit Types"
                    selectionMode="multiple"
                    label="Permit Types"
                    selectedKeys={selectedPermits}
                    onSelectionChange={setSelectedPermits}
                    renderValue={renderSelectedItems}
                    style={{ fontFamily: 'var(--nextui-font-sans)' }}
                    className="absolute top-5 right-5 z-10 bg-white h-auto w-auto min-w-[200px] max-w-[500px] dark:bg-gray-800 shadow-md rounded-md"
                    classNames={{
                        trigger: "min-h-[80px]",
                        listbox: "max-h-[300px]",
                        value: "py-1",
                        popoverContent: "p-0",
                    }}
                >
                    {permitTypes.map((permit) => (
                        <SelectItem
                            key={permit.id}
                            value={permit.id}
                            textValue={permit.label}
                        >
                            <div className="flex items-center gap-2">
                                <Chip
                                    color={permit.color}
                                    variant="flat"
                                    size="sm"
                                >
                                    {permit.label}
                                </Chip>
                                {permit.description && (
                                    <span className="text-tiny text-default-400">
                                        {permit.description}
                                    </span>
                                )}
                            </div>
                        </SelectItem>
                    ))}
                </Select>

                <Map
                    defaultZoom={13}
                    disableDefaultUI={true}
                    defaultCenter={{ lat: 29.643946, lng: -82.355659 }}
                    styles={theme === 'dark' ? darkStyles : lightStyles}
                    onCameraChanged={(ev: MapCameraChangedEvent) =>
                        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                    }
                />
            </div>
        </APIProvider>
    );
}