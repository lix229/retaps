"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { DirectionsRenderer, InfoWindow, Marker, useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useTheme } from 'next-themes';
import { Select, SelectItem, Selection, Chip } from "@nextui-org/react";
import { permitTypes } from '@/types/userData';
import type { DepartData } from '@/types/locations';
import { darkStyles, lightStyles } from '@/data/maps';
import { parking_data } from '@/data/parking_data';

interface MapComponentProps {
    departData?: DepartData;
}



export default function MapComponent({ departData }: MapComponentProps) {
    const { theme } = useTheme();
    const [selectedPermits, setSelectedPermits] = useState<Selection>(new Set([]));
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    });

    const initialCenter = useMemo(() => {
        return departData?.location
            ? { lat: departData.location.LAT, lng: departData.location.LON }
            : { lat: 29.643946, lng: -82.355659 };
    }, [departData]);

    const selectWidth = useMemo(() => {
        const selectedSize = selectedPermits instanceof Set ? selectedPermits.size : 0;
        const baseWidth = 200;
        const additionalWidth = 27;
        const calculatedWidth = baseWidth + (selectedSize * additionalWidth);
        const maxWidth = 900;
        return Math.min(calculatedWidth, maxWidth);
    }, [selectedPermits]);

    useEffect(() => {
        if (departData?.location) {
            const directionsService = new google.maps.DirectionsService();
            var best = null;
            for (var parking_spot in parking_data) {
                var origin = { lat: parking_data[parking_spot].LATITUDE, lng: parking_data[parking_spot].LONGITUDE };
                directionsService.route(
                    {
                        // origin: { lat: 29.643946, lng: -82.355659 },
                        origin: origin,
                        destination: { lat: departData.location.LAT, lng: departData.location.LON },
                        travelMode: google.maps.TravelMode.WALKING,
                    },
                    (result, status) => {
                        if (status === google.maps.DirectionsStatus.OK) {
                            if (!best || result.routes[0].legs[0].duration.value < best.routes[0].legs[0].duration.value) {
                                best = result;
                                setDirections(result);
                            }
                            console.log("Directions:", result);
                        } else {
                            console.error(`Error fetching directions: ${status}`);
                        }
                    }
                );
            }
        }
    }, [departData]);

    if (!isLoaded) return <p>Loading map...</p>;

    const renderSelectedItems = (items: any) => {
        return (
            <div className="flex flex-wrap gap-1">
                {items.map((item: any) => (
                    <Chip
                        key={item.key}
                        color={permitTypes.find(p => p.id === item.key)?.color || "default"}
                        variant="flat"
                        size="sm"
                        className='mt-0'
                    >
                        {item.textValue}
                    </Chip>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full h-full rounded-lg overflow-hidden shadow-lg relative">
            <Select
                size="sm"
                placeholder="Select Permit Types"
                selectionMode="multiple"
                variant='faded'
                aria-label='Permit Types'
                // label="Permit Types"
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
                    trigger: "min-h-[50px]",
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
            <Select
                size="sm"
                placeholder="Preferences"
                variant='faded'
                aria-label='Preferences'
                style={{
                    fontFamily: 'var(--nextui-font-sans)',
                    width: `200px`,
                }}
                className="absolute top-5 w-[100px] left-5 z-10 bg-white h-auto dark:bg-gray-800 shadow-md rounded-md"
                classNames={{
                    trigger: "min-h-[50px]",
                    listbox: "max-h-[300px]",
                    value: "py-0",
                    popoverContent: "p-0",
                }}
                listboxProps={{
                    itemClasses: {
                        base: [
                            "rounded-md",
                            "text-default-500",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground",
                            "data-[hover=true]:bg-default-100",
                            "dark:data-[hover=true]:bg-default-50",
                            "data-[selectable=true]:focus:bg-default-50",
                            "data-[pressed=true]:opacity-70",
                            "data-[focus-visible=true]:ring-default-500",
                        ],
                    },
                }}
            >
                <SelectItem key={'walk_less'}>Walk Less</SelectItem>
                <SelectItem key={'faster'}>Faster</SelectItem>
                <SelectItem key={'no_bus'}>No Bus</SelectItem>
            </Select>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={initialCenter}
                zoom={15}
                options={{
                    styles: theme === 'dark' ? darkStyles : lightStyles,
                    disableDefaultUI: true,
                }}
            >
                {departData?.location && (
                    <Marker
                        position={{ lat: departData.location.LAT, lng: departData.location.LON }}
                        onClick={() => setInfoWindowOpen(true)}
                    >
                        {infoWindowOpen && (
                            <InfoWindow
                                position={{ lat: departData.location.LAT, lng: departData.location.LON }}
                                onCloseClick={() => setInfoWindowOpen(false)}
                            >
                                <div className="m-0 leading-tight text-black h-auto">
                                    <h4 className="text-lg font-bold -mt-1 z-10">{departData.location.NAME}</h4>
                                    <p className="text-sm mt-0">{departData.location.OFFICIAL_ROOM_NAME}</p>
                                </div>
                            </InfoWindow>

                        )}
                    </Marker>
                )}
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{ suppressInfoWindows: true, suppressMarkers: true }}
                    />
                )}
            </GoogleMap>
        </div>
    );