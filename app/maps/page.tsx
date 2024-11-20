"use client";
import DepartDateSelector from "@/components/date-selector";
import Upcoming from "@/components/Upcoming";
import MapComponent from "@/components/maps";
import { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import LoadingScreen from "@/components/loading-screen";
import type { DepartData } from "@/types/locations";
import NoPermitModal from "@/components/NoPermitModal";
const libraries: Library[] = ["places"];

export default function MapsPage() {
  const [departData, setDepartData] = useState<DepartData | undefined>(undefined);
  const [currentDepartData, setCurrentDepartData] = useState<DepartData | undefined>(undefined);
  const [showNoPermitModal, setShowNoPermitModal] = useState(false);
  const [pendingDepartData, setPendingDepartData] = useState<DepartData | undefined>(undefined);
  const [selectedPermits, setSelectedPermits] = useState<Set<string>>(new Set());
  const [isGameDay, setIsGameDay] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY || "",
    libraries,
  });

  if (!isLoaded) return <LoadingScreen />;

  const handleDepartDataChange = (data: DepartData) => {
    setCurrentDepartData(data);
  };

  const handleFindParkingClick = (permits: Set<string>, isGameDay: boolean) => {
    if (permits.size === 0 && !isGameDay) {
      setShowNoPermitModal(true);
      setPendingDepartData(currentDepartData);
    } else {
      setDepartData(currentDepartData);
    }
  };
  const handlePermitChange = (permits: Set<string>) => {
    setSelectedPermits(permits);
  };

  const handleGameDayChange = (isGame: boolean) => {
    setIsGameDay(isGame);
  };
  const handleModalClose = () => {
    setShowNoPermitModal(false);
  };

  const handleModalContinue = () => {
    setShowNoPermitModal(false);
    setDepartData(pendingDepartData);
  };

  const handleUpcomingSelect = (data: DepartData) => {
    setCurrentDepartData(data);
    setDepartData(data);
  };

  return (
    <div className="flex h-[calc(100vh-150px)] w-full">
      <div className="flex flex-row w-full">
        <div className="flex flex-col items-start space-y-4 p-2">
          <div className="flex items-top space-x-0 w-full">
            <DepartDateSelector
              onDepartDataChange={handleDepartDataChange}
              handleFindParkingClick={handleFindParkingClick}
              initialData={departData}
              selectedPermits={selectedPermits}
              isGameDay={isGameDay}
            />
          </div>
          <Upcoming onUpcomingSelect={handleUpcomingSelect} />
        </div>
        <div className="flex flex-col w-full p-2 h-full">
          <div className="flex-1 w-full">
            <MapComponent
              departData={departData}
              currentDepartData={currentDepartData}
              onFindParking={handleFindParkingClick}
              onPermitChange={handlePermitChange}
              onGameDayChange={handleGameDayChange}
            />
          </div>
        </div>
      </div>
      <NoPermitModal
        isOpen={showNoPermitModal}
        onClose={handleModalClose}
        onContinue={handleModalContinue}
      />
    </div>
  );
}