"use client";

import React, { useMemo, useState } from 'react';
import { APIProvider, Map, MapCameraChangedEvent, Marker } from '@vis.gl/react-google-maps';
import { useTheme } from 'next-themes';
import { Select, SelectItem, Selection, Chip } from "@nextui-org/react";
import { permitTypes } from '@/types/userData';
import type { DepartData } from '@/types/locations';

interface MapComponentProps {
    departData?: DepartData;
}

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

export default function MapComponent({ departData }: MapComponentProps) {
    const { theme } = useTheme();
    const [selectedPermits, setSelectedPermits] = useState<Selection>(new Set([]));

    // Compute the initial center based on departData or default values
    const initialCenter = useMemo(() => {
        return departData?.location
            ? { lat: departData.location.LAT, lng: departData.location.LON }
            : { lat: 29.643946, lng: -82.355659 };
    }, [departData]);

    // Update map key when departData changes to force re-render with new center
    const mapKey = useMemo(() => {
        return departData?.location ? `map-${departData.location.LAT}-${departData.location.LON}` : 'default-map';
    }, [departData]);

    const selectWidth = useMemo(() => {
        const selectedSize = selectedPermits instanceof Set ? selectedPermits.size : 0;
        const baseWidth = 200;
        const additionalWidth = 27;
        const calculatedWidth = baseWidth + (selectedSize * additionalWidth);
        const maxWidth = 900;
        return Math.min(calculatedWidth, maxWidth);
    }, [selectedPermits]);

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
            <div className="w-full h-full rounded-lg overflow-hidden shadow-lg relative">
                <Select
                    size="sm"
                    placeholder="Select Permit Types"
                    selectionMode="multiple"
                    label={<span className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Permit Types</span>}
                    selectedKeys={selectedPermits}
                    onSelectionChange={setSelectedPermits}
                    renderValue={renderSelectedItems}
                    style={{
                        fontFamily: 'var(--nextui-font-sans)',
                        width: `${selectWidth}px`,
                        transition: 'width 0.2s ease-in-out',
                    }}
                    className="absolute top-5 w-[${selectWidth}px] right-5 z-10 bg-white h-auto dark:bg-gray-800 shadow-md rounded-md"
                    classNames={{
                        trigger: "min-h-[80px]",
                        listbox: "max-h-[300px] ",
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
                    key={mapKey}
                    defaultZoom={15}
                    disableDefaultUI={true}
                    defaultCenter={initialCenter}
                    styles={theme === 'dark' ? darkStyles : lightStyles}
                    onCameraChanged={(ev: MapCameraChangedEvent) =>
                        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                    }
                >
                    {departData?.location && (
                        <Marker
                            position={{ lat: departData.location.LAT, lng: departData.location.LON }}
                            title={departData.location.NAME}
                        />
                    )}
                </Map>
            </div>
        </APIProvider>
    );
}
