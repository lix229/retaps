"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { DirectionsRenderer, InfoWindow, Marker, useLoadScript, GoogleMap, OverlayView } from '@react-google-maps/api';
import { useTheme } from 'next-themes';
import { Select, SelectItem, Selection, Chip } from "@nextui-org/react";
import { permitTypes } from '@/types/userData';
import type { DepartData, ParkingSpotType, ValidParkingDirections } from '@/types/locations';
import { darkStyles, lightStyles } from '@/data/maps';
import { parking_data } from '@/data/parking_data';
import { compare_routes, filter_parking_data } from '@/utils/map_utils';

interface MapComponentProps {
    departData?: DepartData;
}

export default function MapComponent({ departData }: MapComponentProps) {
    const { theme } = useTheme();
    const [selectedPermits, setSelectedPermits] = useState<Selection>(new Set([]));
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [topParkingSpots, setTopParkingSpots] = useState<
        Array<{ parkingSpot: ParkingSpotType; directionsResult: google.maps.DirectionsResult }>
    >([]);
    const [selectedPreference, setSelectedPreference] = useState<string>('faster');

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
            var filteredParkingData = filter_parking_data(parking_data, departData, Array.from(selectedPermits).map(String));
            const directionsService = new google.maps.DirectionsService();
            const promises = Object.values(filteredParkingData).map((parkingSpot) => {
                const origin = { lat: parkingSpot.LATITUDE, lng: parkingSpot.LONGITUDE };
                return new Promise<{ parkingSpot: ParkingSpotType; directionsResult: google.maps.DirectionsResult | null }>((resolve) => {
                    directionsService.route(
                        {
                            origin,
                            destination: { lat: departData.location.LAT, lng: departData.location.LON },
                            travelMode: google.maps.TravelMode.TRANSIT,
                        },
                        (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK && result) {
                                resolve({ parkingSpot, directionsResult: result });
                            } else {
                                resolve({ parkingSpot, directionsResult: null });
                            }
                        }
                    );
                });
            });

            Promise.all(promises).then((results) => {
                const validResults = results.filter(
                    (item): item is ValidParkingDirections => item.directionsResult !== null
                );
                console.log("ParkingSpots", validResults);

                const top10Results = validResults
                    .sort(
                        (a, b) => compare_routes(a, b, selectedPreference)
                    )
                    .slice(0, 10);

                setTopParkingSpots(top10Results);

            });
        }
    }, [departData, selectedPermits, selectedPreference]);



    if (!isLoaded) return <p>Loading map...</p>;

    const route = topParkingSpots[0]?.directionsResult.routes[0];
    const path = route?.overview_path;

    // Calculate midpoint index
    const midpointIndex = path ? Math.floor(path.length / 2) : 0;

    // Get the midpoint coordinates
    const midpoint = path
        ? {
            lat: path[midpointIndex].lat(),
            lng: path[midpointIndex].lng(),
        }
        : null;

    const duration = route?.legs[0].duration.text;

    function RouteDurationOverlay({ position, duration, theme }) {
        return (
            <OverlayView
                position={position}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
                <div
                    className={`route-duration-overlay ${theme === 'dark' ? 'dark' : 'light'} w-[70px]`}
                    style={{
                        backgroundColor: theme === 'dark' ? '#333' : '#fff',
                        color: theme === 'dark' ? '#fff' : '#000',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        border: `2px solid ${theme === 'dark' ? '#fff' : '#000'}`,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {duration}
                </div>
            </OverlayView>
        );
    }

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
                selectedKeys={selectedPermits}
                onSelectionChange={setSelectedPermits}
                renderValue={renderSelectedItems}
                style={{
                    fontFamily: 'var(--nextui-font-sans)',
                    width: `${selectWidth}px`,
                    transition: 'width 0.2s ease-in-out',
                }}
                className="absolute top-5 w-[${selectWidth}px] right-5 z-10 h-auto shadow-md rounded-md"
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
                placeholder="Preferences"
                label="I prefer to"
                variant='faded'
                aria-label='Preferences'
                defaultSelectedKeys={['faster']}
                selectedKeys={new Set([selectedPreference])}
                onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys).pop();
                    if (typeof selectedKey === 'string') {
                        setSelectedPreference(selectedKey);
                    }
                }}
                style={{
                    fontFamily: 'var(--nextui-font-sans)',
                    width: `200px`,
                }}
                className="absolute top-5 w-[100px] left-5 z-10 h-auto"
                classNames={{
                    trigger: "min-h-[60px]",
                    listbox: "max-h-[300px]",
                    value: "py-0",
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
                <SelectItem key={'faster'}>Arrive Sooner</SelectItem>
                <SelectItem key={'no_bus'}>Not Taking Bus</SelectItem>
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
                        label={{
                            text: departData.location.NAME,
                            color: theme === 'dark' ? '#fff' : '#000',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            className: 'border-3 border-blue-500 p-2 bg-white dark:bg-gray-800 rounded-md -mt-5',
                        }}
                        icon={{
                            url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png",
                        }}
                    >
                    </Marker>
                )}
                {topParkingSpots[0] && (
                    <React.Fragment>
                        <Marker
                            position={{
                                lat: topParkingSpots[0].directionsResult.routes[0].legs[0].start_location.lat(),
                                lng: topParkingSpots[0].directionsResult.routes[0].legs[0].start_location.lng(),
                            }}
                            label={{
                                text: topParkingSpots[0].parkingSpot.Name,
                                color: theme === 'dark' ? '#fff' : '#000',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                className: 'border-3 border-blue-500 p-2 bg-white dark:bg-gray-800 rounded-md -mt-6 z-10',
                            }}
                            icon={{
                                url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png",
                            }}

                        />
                        <DirectionsRenderer
                            directions={topParkingSpots[0].directionsResult}
                            options={{ suppressInfoWindows: true, suppressMarkers: true }}
                        />
                        {midpoint && duration && (
                            <RouteDurationOverlay
                                position={midpoint}
                                duration={duration}
                                theme={theme}
                            />
                        )}
                    </React.Fragment>
                )}
            </GoogleMap>
        </div>
    );
}