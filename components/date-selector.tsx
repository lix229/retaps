"use client";
import { useState, useEffect } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/input";
import AutocompleteList from "@/components/AutocompleteList";
import { TimeInput } from "@nextui-org/date-input";
import { getLocalTimeZone, today, now } from "@internationalized/date";
import { DepartData } from "@/types/locations";
import { Autocomplete } from "@react-google-maps/api";
import { Button } from "@nextui-org/button";


interface DepartDateSelectorProps {
    onDepartDataChange: (data: DepartData) => void;
    handleFindParkingClick: (selectedPermits: Set<string>, isGameDay: boolean) => void;
    initialData?: DepartData;
    selectedPermits: Set<string>;
    isGameDay: boolean;
}


export default function DepartDateSelector({
    onDepartDataChange,
    handleFindParkingClick,
    initialData,
    selectedPermits,
    isGameDay
}: DepartDateSelectorProps) {
    // Set default values for today's date and current time
    const defaultDate = today(getLocalTimeZone());
    const defaultTime = now(getLocalTimeZone()).add({ minutes: 10 });
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [location, setLocation] = useState<google.maps.places.PlaceResult | undefined>(undefined);
    const [departData, setDepartData] = useState<DepartData>({
        departure_location: null,
        location: null,
        date: defaultDate,
        time: defaultTime,
    });

    useEffect(() => {
        onDepartDataChange(departData);
    }, [departData, onDepartDataChange]);

    useEffect(() => {
        if (initialData) {
            setDepartData(initialData);
        }
    }, [initialData]);

    const handleDepartDataChange = (key: keyof DepartData, value: any) => {
        setDepartData((prevData) => ({ ...prevData, [key]: value }));
    };

    const handleDateChange = (value: any) => {
        handleDepartDataChange("date", value);
        onDepartDataChange({
            ...departData,
            date: value
        });
    };

    const isTodaySelected = departData.date && departData.date.compare(defaultDate) === 0;
    const minimumTime = isTodaySelected ? now(getLocalTimeZone()) : undefined;

    const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            setLocation(place);
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                handleDepartDataChange("departure_location", { lat, lng });
            } else {
                console.warn("No location data available for the selected place");
            }
        }
    };
    return (
        <div className="space-y-3">
            <div className="flex flex-row item-start space-x-2">
                <div className="flex flex-col space-y-2">
                    <Autocomplete
                        className="w-[250px] rounded-[11px] shadow-medium"
                        onLoad={onLoad}
                        onPlaceChanged={onPlaceChanged}>
                        <Input
                            type="text"
                            label="Departure (Optional)"
                            placeholder=""
                            className="p-0 rounded-md w-[250px]"
                            value={location?.name}
                            onChange={(e) => setLocation({ ...location, name: e.target.value })}
                        />
                    </Autocomplete>
                    <AutocompleteList onSelect={(location) => handleDepartDataChange("location", location)} />
                </div>
                <Button
                    radius="full"
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg w-[120px] h-[120px] rounded-lg flex flex-col items-center justify-center text-center text-[23px] font-extrabold"
                    style={{ fontFamily: "'Newsreader', serif" }}
                    onClick={() => handleFindParkingClick(selectedPermits, isGameDay)}
                >
                    Get&nbsp;Me
                    <br />
                    There
                </Button>
            </div>
            <div className="flex-row flex space-x-1 ">
                <DatePicker
                    label="Pick a date"
                    className="w-[195px] rounded-[12px]"
                    onChange={(value) => handleDateChange(value)}
                    minValue={defaultDate}
                    defaultValue={defaultDate}
                    value={departData.date}
                />
                <TimeInput
                    label="Pick a time"
                    className="w-[180px] rounded-[12px]"
                    onChange={(value) => handleDepartDataChange("time", value)}
                    minValue={minimumTime}
                    value={departData.time}
                />
            </div>
        </div>
    );
}
