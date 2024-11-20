"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { DirectionsRenderer, InfoWindow, Marker, useLoadScript, GoogleMap, OverlayView } from '@react-google-maps/api';
import { useTheme } from 'next-themes';
import { Select, SelectItem, Selection, Chip, Button, DateValue } from "@nextui-org/react";
import { permitTypes, gamePermits } from '@/types/userData';
import type { DepartData, ParkingSpotType, ValidParkingDirections } from '@/types/locations';
import { darkStyles, lightStyles } from '@/data/maps';
import { parking_data } from '@/data/parking_data';
import { parking_data_football } from '@/data/parking_data_football';
import { compare_routes, filter_parking_data, isFootballGameDate, getFootballGameData, calculateTotalDuration } from '@/utils/map_utils';
import { MemoizedDestinationOverlay, MemoizedParkingOverlay, MemoizedDepartureOverlay, MemoizedRouteDurationOverlay } from '@/components/map-overlays';

interface MapComponentProps {
    departData?: DepartData;
    currentDepartData?: DepartData;
}

export default function MapComponent({ departData, currentDepartData }: MapComponentProps) {
    const { theme } = useTheme();
    const [selectedPermits, setSelectedPermits] = useState<Selection>(new Set([]));
    const [topParkingSpots, setTopParkingSpots] = useState<
        Array<ValidParkingDirections>
    >([]);
    const [selectedPreference, setSelectedPreference] = useState<string>('faster');
    const [currentRoute, setCurrentRoute] = useState<number>(0);
    const [selectedGamePermits, setSelectedGamePermits] = useState<Selection>(new Set([]));
    const [isGameDay, setIsGameDay] = useState<boolean>(false);
    const initialCenter = useMemo(() => {
        return departData?.location
            ? { lat: departData.location.LAT, lng: departData.location.LON }
            : { lat: 29.643946, lng: -82.355659 };
    }, [departData]);


    useEffect(() => {
        if (currentDepartData?.date) {
            setIsGameDay(isFootballGameDate(currentDepartData.date));
        } else {
            setIsGameDay(false);
        }
    }, [currentDepartData?.date]);

    const selectWidth = useMemo(() => {
        const selectedSize = selectedPermits instanceof Set ? selectedPermits.size : 0;
        const baseWidth = 250;
        const additionalWidth = 10;
        const calculatedWidth = baseWidth + (selectedSize * additionalWidth);
        const maxWidth = 900;
        return Math.min(calculatedWidth, maxWidth);
    }, [selectedPermits]);


    const selectGameWidth = useMemo(() => {
        const selectedSize = selectedGamePermits instanceof Set ? selectedGamePermits.size : 0;
        const baseWidth = 250;
        const additionalWidth = 15;
        const calculatedWidth = baseWidth + (selectedSize * additionalWidth);
        const maxWidth = 900;
        return Math.min(calculatedWidth, maxWidth);
    }, [selectedGamePermits]);

    useEffect(() => {
        if (departData?.location) {
            const parkingDataToUse = departData.date && isFootballGameDate(departData.date)
                ? getFootballGameData(departData.date)?.parking_data
                : parking_data;

            if (isFootballGameDate(departData.date!)) {
                console.log(
                    "football game data",
                );
            }
            const filteredParkingData = filter_parking_data(
                (isGameDay ? getFootballGameData(departData.date!)?.parking_data : parking_data) as ParkingSpotType[],
                departData,
                Array.from(selectedPermits).map(String),
                Array.from(selectedGamePermits).map(String)
            );

            const TRANSIT_MODE = selectedPreference === 'no_bus' ? google.maps.TravelMode.WALKING : google.maps.TravelMode.TRANSIT;
            const directionsService = new google.maps.DirectionsService();

            const promises = Object.values(filteredParkingData).map((parkingSpot) => {
                const parkingLocation = { lat: parkingSpot.LATITUDE, lng: parkingSpot.LONGITUDE };
                const destination = { lat: departData.location!.LAT, lng: departData.location!.LON };

                return new Promise<ValidParkingDirections>((resolve) => {
                    // Get transit/walking directions from parking to destination
                    directionsService.route(
                        {
                            origin: parkingLocation,
                            destination: destination,
                            travelMode: TRANSIT_MODE,
                        },
                        (transitResult, transitStatus) => {
                            if (transitStatus !== google.maps.DirectionsStatus.OK) {
                                resolve({ parkingSpot, directionsResult: transitResult! });
                                return;
                            }

                            // If departure location exists, get driving directions to parking
                            if (departData.departure_location) {
                                directionsService.route(
                                    {
                                        origin: {
                                            lat: departData.departure_location.lat,
                                            lng: departData.departure_location.lng
                                        },
                                        destination: parkingLocation,
                                        travelMode: google.maps.TravelMode.DRIVING,
                                    },
                                    (drivingResult, drivingStatus) => {
                                        if (drivingStatus === google.maps.DirectionsStatus.OK) {
                                            const totalDuration = calculateTotalDuration(transitResult!, drivingResult!);
                                            resolve({
                                                parkingSpot,
                                                directionsResult: transitResult!,
                                                drivingDirections: drivingResult!,
                                                totalDuration: totalDuration
                                            });
                                        } else {
                                            resolve({
                                                parkingSpot,
                                                directionsResult: transitResult!,
                                                totalDuration: calculateTotalDuration(transitResult!)
                                            });
                                        }
                                    }
                                );
                            } else {
                                resolve({
                                    parkingSpot,
                                    directionsResult: transitResult!,
                                    totalDuration: calculateTotalDuration(transitResult!)
                                });
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
                    .sort((a, b) => {
                        if (selectedPreference === 'faster') {
                            return (a.totalDuration || 0) - (b.totalDuration || 0);
                        }
                        return compare_routes(a, b, selectedPreference);
                    })
                    .slice(0, 10);

                setTopParkingSpots(top10Results);
                setCurrentRoute(0);
            });
        }
    }, [departData, selectedPermits, selectedPreference, selectedGamePermits]);

    const handlePreviousRoute = () => {
        setCurrentRoute((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNextRoute = () => {
        setCurrentRoute((prev) => (prev < topParkingSpots.length - 1 ? prev + 1 : prev));
    };

    const getDrivingMidpoint = useMemo(() => {
        if (!topParkingSpots[currentRoute]?.drivingDirections?.routes?.[0]?.legs?.[0]) return null;
        const steps = topParkingSpots[currentRoute].drivingDirections!.routes[0].legs[0].steps;
        const midStepIndex = Math.floor(steps.length / 2);
        return {
            lat: steps[midStepIndex].start_location.lat(),
            lng: steps[midStepIndex].start_location.lng()
        };
    }, [topParkingSpots, currentRoute]);

    const parkingPosition = useMemo(() => {
        if (!topParkingSpots[currentRoute]?.directionsResult?.routes?.[0]?.legs?.[0]) return null;
        return {
            lat: topParkingSpots[currentRoute].directionsResult.routes[0].legs[0].start_location.lat(),
            lng: topParkingSpots[currentRoute].directionsResult.routes[0].legs[0].start_location.lng()
        };
    }, [topParkingSpots, currentRoute]);

    const departurePosition = useMemo(() => {
        if (!departData?.departure_location) return null;
        return {
            lat: departData.departure_location.lat,
            lng: departData.departure_location.lng
        };
    }, [departData]);
    const route = topParkingSpots[currentRoute]?.directionsResult.routes[0];
    const path = route?.overview_path;

    const midpointIndex = path ? Math.floor(path.length / 2) : 0;

    // Get the midpoint coordinates
    const midpoint = path
        ? {
            lat: path[midpointIndex].lat(),
            lng: path[midpointIndex].lng(),
        }
        : null;

    const duration = route?.legs[0].duration!.text;

    const renderSelectedItems = (items: any) => {
        return (
            <div className="flex flex-wrap gap-1">
                {items.map((item: any) => {
                    const permit = permitTypes.find(p => p.id === item.key);
                    return (
                        <Chip
                            key={item.key}
                            variant="flat"
                            size="sm"
                            className='mt-0'
                            style={{
                                backgroundColor: permit?.color.default || "default",
                                color: permit?.color.foreground || "#000000",
                                boxShadow: `0 2px 3px ${permit?.color.default?.replace(/[\d.]+\)$/, '0.6)') || "rgba(0,0,0,0.6)"}`,
                            }}
                        >
                            {item.textValue}
                        </Chip>
                    );
                })}
            </div>
        );
    };

    const renderSelectedGameItems = (items: any) => {
        return (
            <div className="flex flex-wrap gap-1">
                {items.map((item: any) => {
                    const permit = gamePermits.find(p => p.id === item.key);
                    return (
                        <Chip
                            key={item.key}
                            variant="flat"
                            size="sm"
                            className='mt-0'
                            style={{
                                backgroundColor: permit?.color.default || "default",
                                color: permit?.color.foreground || "#000000",
                                boxShadow: `0 2px 3px ${permit?.color.default?.replace(/[\d.]+\)$/, '0.6)') || "rgba(0,0,0,0.6)"}`,
                            }}
                        >
                            {permit?.label}
                        </Chip>
                    );
                })}
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
                    trigger: "min-h-[50px] h-auto",
                    listbox: "max-h-[300px]",
                    value: "py-3",
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
                                variant="flat"
                                size="sm"
                                style={{
                                    backgroundColor: permit.color.default,
                                    color: permit.color.foreground,
                                    boxShadow: `0 3px 5px ${permit?.color.default?.replace(/[\d.]+\)$/, '0.6)') || "rgba(0,0,0,0.6)"}`,
                                }}
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

            {/* {true && ( */}
            {isGameDay && (

                <div className="absolute top-20 right-5 z-10">
                    <Select
                        label={
                            <div className="flex items-center gap-2">
                                <span className="animate-pulse bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent font-bold">
                                    🎉 GAME DAY Options
                                </span>
                            </div>
                        }
                        selectionMode="multiple"
                        selectedKeys={selectedGamePermits}
                        renderValue={renderSelectedGameItems}
                        variant='flat'
                        onSelectionChange={setSelectedGamePermits}
                        style={{
                            width: `${selectGameWidth}px`,
                            transition: 'width 0.2s ease-in-out',
                        }}
                        classNames={{
                            trigger: "w-[${selectGameWidth}px] bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border-orange-500/30",
                            value: "text-orange-600 dark:text-orange-400",
                        }}
                    >
                        {gamePermits.map((permit) => (
                            <SelectItem
                                key={permit.id}
                                textValue={permit.id}
                                className="capitalize"
                            >
                                <div className="flex items-center gap-2">
                                    <Chip
                                        variant="flat"
                                        size="sm"
                                        style={{
                                            backgroundColor: permit.color.default,
                                            color: permit.color.foreground,
                                            boxShadow: `0 2px 4px ${permit.color.default}80`,
                                        }}
                                    >
                                        {permit.label}
                                    </Chip>
                                    <span className="text-tiny text-default-400">
                                        {permit.description}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            )}
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
                <SelectItem
                    key={'drive_less'}
                    isDisabled={!departData?.departure_location}
                    description={!departData?.departure_location ? "Requires departure location" : undefined}
                >
                    Drive Less
                </SelectItem>
                <SelectItem
                    key={'less_transit'}
                    isDisabled={!departData?.departure_location}
                    description={!departData?.departure_location ? "Requires departure location" : undefined}
                >
                    Spend less time after parked
                </SelectItem>
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
                    <MemoizedDestinationOverlay
                        position={{ lat: departData.location.LAT, lng: departData.location.LON }}
                        name={departData.location.NAME}
                    />
                )}
                {topParkingSpots[currentRoute] && parkingPosition && (
                    <>
                        <MemoizedParkingOverlay
                            key={`parking-${topParkingSpots[currentRoute].parkingSpot.Name}`}
                            position={parkingPosition}
                            name={topParkingSpots[currentRoute].parkingSpot.Name}
                        />
                        <DirectionsRenderer
                            key={`transit-${currentRoute}`}
                            directions={topParkingSpots[currentRoute].directionsResult}
                            options={{ suppressInfoWindows: true, suppressMarkers: true }}
                        />
                        {midpoint && duration && (
                            <MemoizedRouteDurationOverlay
                                key={`transit-duration-${duration}`}
                                position={midpoint}
                                duration={duration}
                                theme={theme || 'light'}
                            />
                        )}
                        {getDrivingMidpoint && departurePosition && (
                            <>
                                <DirectionsRenderer
                                    key={`driving-${currentRoute}`}
                                    directions={(topParkingSpots[currentRoute] as ValidParkingDirections).drivingDirections}
                                    options={{
                                        suppressInfoWindows: true,
                                        suppressMarkers: true,
                                    }}
                                />
                                <MemoizedRouteDurationOverlay
                                    key={`driving-duration-${currentRoute}`}
                                    position={getDrivingMidpoint}
                                    duration={(topParkingSpots[currentRoute] as ValidParkingDirections)
                                        .drivingDirections!.routes[0].legs[0].duration!.text}
                                    theme={theme || 'light'}
                                />
                            </>
                        )}
                    </>
                )}
                {departurePosition && (
                    <MemoizedDepartureOverlay
                        key="departure"
                        position={departurePosition}
                    />
                )}
            </GoogleMap>

        </div >
    );
}
