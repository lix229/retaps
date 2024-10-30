"use client";
import { useState } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import AutocompleteList from "@/components/AutocompleteList";
import { TimeInput } from "@nextui-org/date-input";
import { DateValue, getLocalTimeZone, today, now } from "@internationalized/date";
import type { TimeValue } from "@react-types/datepicker";

interface DepartData {
    location: string | null;
    date: DateValue | null;
    time: TimeValue | null;
}

export default function DepartDateSelector() {
    // Set default values for today's date and current time
    const defaultDate = today(getLocalTimeZone());
    const defaultTime = now(getLocalTimeZone()).add({ minutes: 10 });

    const [departData, setDepartData] = useState<DepartData>({
        location: null,
        date: defaultDate,
        time: defaultTime,
    });

    const handleLocationSelect = (location: string) => {
        setDepartData((prevData) => ({ ...prevData, location }));
        console.log("Updated depart data:", { ...departData, location });
    };

    const handleDateChange = (value: DateValue) => {
        setDepartData((prevData) => ({ ...prevData, date: value }));
        console.log("Updated depart data:", { ...departData, date: value });
    };

    const handleTimeChange = (value: TimeValue) => {
        setDepartData((prevData) => ({ ...prevData, time: value }));
        console.log("Updated depart data:", { ...departData, time: value });
    };

    // Determine minimum time based on whether the selected date is today
    const isTodaySelected = departData.date && departData.date.compare(defaultDate) === 0;
    const minimumTime = isTodaySelected ? now(getLocalTimeZone()) : undefined;

    return (
        <div className="space-y-2">
            <AutocompleteList onSelect={handleLocationSelect} />
            <div className="flex-row flex space-x-1">
                <DatePicker
                    label="Pick a date"
                    className="w-[170px] rounded-[12px] shadow-medium"
                    onChange={handleDateChange}
                    minValue={defaultDate}
                    defaultValue={defaultDate}
                    value={departData.date} // Set initial value for DatePicker
                />
                <TimeInput
                    label="Pick a time"
                    className="w-[130px] rounded-[12px] shadow-medium"
                    onChange={handleTimeChange}
                    minValue={minimumTime}
                    value={departData.time} // Set initial value for TimeInput
                />
            </div>
        </div>
    );
}
