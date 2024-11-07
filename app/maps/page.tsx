"use client";
import DepartDateSelector from "@/components/date-selector";
import { Button } from "@nextui-org/button";
import Upcoming from "@/components/Upcoming";
import MapComponent from "@/components/maps";
import { useState } from "react";
import { useLoadScript, Library } from "@react-google-maps/api";

const DEBUGGING = false;
const libraries: Library[] = ["places"];


export default function MapsPage() {
  const [departData, setDepartData] = useState(undefined);
  const [parkingData, setParkingData] = useState(undefined);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY || "",
    libraries,
  });

  const handleDepartDataChange = (data: any) => {
    setDepartData(data);
  };

  const handleFindParkingClick = () => {
    setParkingData(departData);
    console.log("Sending departData to MapComponent:", departData);
  };



  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className={`flex h-[calc(100vh-150px)] w-full ${DEBUGGING ? "bg-green-200" : ""}`}>
      <div className={`flex flex-row w-full ${DEBUGGING ? "bg-green-200" : ""}`}>
        <div className="flex flex-col items-start space-y-4 p-2">
          <div className="flex items-top space-x-0 w-full">
            <DepartDateSelector onDepartDataChange={handleDepartDataChange} handleFindParkingClick={handleFindParkingClick} />
          </div>
          <Upcoming />
        </div>

        <div className={`flex flex-col w-full p-2 ${DEBUGGING ? "bg-red-200" : ""} h-full`}>
          <div className={`${DEBUGGING ? "bg-gray-200" : ""} flex-1 w-full`}>
            <MapComponent departData={parkingData} />
          </div>
        </div>
      </div>
    </div>
  );
}
