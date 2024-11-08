"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { DirectionsRenderer, InfoWindow, Marker, useLoadScript, GoogleMap, OverlayView } from '@react-google-maps/api';
import { useTheme } from 'next-themes';
import { Select, SelectItem, Selection, Chip, Button } from "@nextui-org/react";
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
    const [currentRoute, setCurrentRoute] = useState<number>(0);

    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    // });

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
            const filteredParkingData = filter_parking_data(parking_data as ParkingSpotType[], departData, Array.from(selectedPermits).map(String));
            const TRANSIT_MODE = selectedPreference === 'no_bus' ? google.maps.TravelMode.WALKING : google.maps.TravelMode.TRANSIT;
            const directionsService = new google.maps.DirectionsService();
            const promises = Object.values(filteredParkingData).map((parkingSpot) => {
                const origin = { lat: parkingSpot.LATITUDE, lng: parkingSpot.LONGITUDE };
                return new Promise<{ parkingSpot: ParkingSpotType; directionsResult: google.maps.DirectionsResult | null }>((resolve) => {
                    directionsService.route(
                        {
                            origin,
                            destination: { lat: departData.location!.LAT, lng: departData.location!.LON },
                            travelMode: TRANSIT_MODE,
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

                const top10Results = validResults
                    .sort(
                        (a, b) => compare_routes(a, b, selectedPreference)
                    )
                    .slice(0, 10);

                setTopParkingSpots(top10Results);
                setCurrentRoute(0); // Reset to the first route on new data
            });
        }
    }, [departData, selectedPermits, selectedPreference]);

    const handlePreviousRoute = () => {
        setCurrentRoute((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNextRoute = () => {
        setCurrentRoute((prev) => (prev < topParkingSpots.length - 1 ? prev + 1 : prev));
    };

    // if (!isLoaded) return <p>Loading map...</p>;

    const route = topParkingSpots[currentRoute]?.directionsResult.routes[0];
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

    const duration = route?.legs[0].duration!.text;

    function RouteDurationOverlay({ position, duration, theme }: { position: google.maps.LatLngLiteral; duration: string; theme: string }) {
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
                    width: `270px`,
                }}
                className="absolute top-5 w-[150px] left-5 z-10 h-auto"
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
                <SelectItem key={'no_bus'}>Avoid busses</SelectItem>
            </Select>
            <Button
                className="absolute top-[90px] w-[130px] left-5 z-10 h-[40px]"
                color='primary'
                variant='shadow'
                onClick={handlePreviousRoute}
                isDisabled={currentRoute === 0}
            >Previous Route</Button>
            <Button
                className="absolute top-[90px] w-[130px] left-[160px] z-10 h-[40px]"
                color='primary'
                variant='shadow'
                onClick={handleNextRoute}
                isDisabled={currentRoute === topParkingSpots.length - 1}
            >Next Route</Button>
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
                    <>
                        {/* <Marker
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
                        </Marker> */}
                        <OverlayView
                            position={{
                                lat: departData.location.LAT, lng: departData.location.LON
                            }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <Chip
                                // color="success"
                                variant="shadow"
                                classNames={{
                                    base: "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white border-white/50 shadow-pink-500/30",
                                    content: "drop-shadow shadow-black text-white",
                                }}
                                size="lg"
                                style={{
                                    padding: '5px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {departData.location.NAME}
                            </Chip>
                        </OverlayView>
                    </>
                )}
                {topParkingSpots[currentRoute] && (
                    <React.Fragment>
                        {/* <Marker
                            position={{
                                lat: topParkingSpots[currentRoute].directionsResult.routes[0].legs[0].start_location.lat(),
                                lng: topParkingSpots[currentRoute].directionsResult.routes[0].legs[0].start_location.lng(),
                            }}
                            label={{
                                text: topParkingSpots[currentRoute].parkingSpot.Name,
                                color: theme === 'dark' ? '#fff' : '#000',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                className: 'border-3 border-blue-500 p-2 bg-white dark:bg-gray-800 rounded-md -mt-6 z-10',
                            }}
                            icon={{
                                url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png",
                            }}
                        /> */}
                        <OverlayView
                            position={{
                                lat: topParkingSpots[currentRoute].directionsResult.routes[0].legs[0].start_location.lat(),
                                lng: topParkingSpots[currentRoute].directionsResult.routes[0].legs[0].start_location.lng(),
                            }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <Chip
                                color="warning"
                                variant="shadow"
                                size="lg"
                                style={{
                                    padding: '5px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {topParkingSpots[currentRoute].parkingSpot.Name}
                            </Chip>
                        </OverlayView>
                        <DirectionsRenderer
                            directions={topParkingSpots[currentRoute].directionsResult}
                            options={{ suppressInfoWindows: true, suppressMarkers: true }}
                        />
                        {midpoint && duration && (
                            <RouteDurationOverlay
                                position={midpoint}
                                duration={duration}
                                theme={theme || 'light'}
                            />
                        )}
                    </React.Fragment>
                )}
            </GoogleMap>
        </div >
    );
}
