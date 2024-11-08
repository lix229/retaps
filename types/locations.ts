import type { TimeValue } from "@react-types/datepicker";
import { DateValue } from "@internationalized/date";

export interface DepartData {
    location: Location | null;
    date: DateValue | null;
    time: TimeValue | null;
}


export interface Location {
        BLDGCODE: string
        BLDG: string
        NAME: string
        ABBREV: string
        OFFICIAL_ROOM_NAME: string
        LAT: number
        LON: number
        SITECODE: string
        BLDG_NAME: string
}


export interface ParkingSpotType {
    Name: string;
    LATITUDE: number;
    LONGITUDE: number;
    Permit: string;
    'Permit holders allowed': string;
    Start: string;
    End: string;
}

export interface ValidParkingDirections {
    parkingSpot: ParkingSpotType;
    directionsResult: google.maps.DirectionsResult
}