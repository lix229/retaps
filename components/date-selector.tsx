"use client";
import { useState, useEffect } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import AutocompleteList from "@/components/AutocompleteList";
import { TimeInput } from "@nextui-org/date-input";
import { getLocalTimeZone, today, now } from "@internationalized/date";
import { DepartData } from "@/types/locations";

interface DepartDateSelectorProps {
    onDepartDataChange: (data: DepartData) => void;
}

export default function DepartDateSelector({ onDepartDataChange }: DepartDateSelectorProps) {
    // Set default values for today's date and current time
    const defaultDate = today(getLocalTimeZone());
    const defaultTime = now(getLocalTimeZone()).add({ minutes: 10 });

    const [departData, setDepartData] = useState<DepartData>({
        location: null,
        date: defaultDate,
        time: defaultTime,
    });

    useEffect(() => {
        onDepartDataChange(departData);
    }, [departData, onDepartDataChange]);

    const handleDepartDataChange = (key: keyof DepartData, value: any) => {
        setDepartData((prevData) => ({ ...prevData, [key]: value }));
    };

    // Determine minimum time based on whether the selected date is today
    const isTodaySelected = departData.date && departData.date.compare(defaultDate) === 0;
    const minimumTime = isTodaySelected ? now(getLocalTimeZone()) : undefined;

    return (
        <div className="space-y-2">
            <AutocompleteList onSelect={(location) => handleDepartDataChange("location", location)} />
            <div className="flex-row flex space-x-1">
                <DatePicker
                    label="Pick a date"
                    className="w-[170px] rounded-[12px]"
                    onChange={(value) => handleDepartDataChange("date", value)}
                    minValue={defaultDate}
                    defaultValue={defaultDate}
                    value={departData.date}
                />
                <TimeInput
                    label="Pick a time"
                    className="w-[130px] rounded-[12px]"
                    onChange={(value) => handleDepartDataChange("time", value)}
                    minValue={minimumTime}
                    value={departData.time}
                />
            </div>
        </div>
    );
}
