import { DepartData, ParkingSpotType } from "@/types/locations";

export function compare_routes(a: any, b: any, preference: string) {
    if (preference === 'faster') {
      return (
        a.directionsResult.routes[0].legs[0].duration!.value -
        b.directionsResult.routes[0].legs[0].duration!.value
      );
    } else if (preference === 'walk_less') {
      const getWalkingDuration = (route: any) => {
        return route.directionsResult.routes[0].legs[0].steps
          .filter((step: any) => step.travel_mode === 'WALKING')
          .reduce((sum: number, step: any) => sum + step.duration.value, 0);
      };
  
      const aWalkingDuration = getWalkingDuration(a);
      const bWalkingDuration = getWalkingDuration(b);
  
      return aWalkingDuration - bWalkingDuration;
    } else if (preference === 'no_bus') {
      const hasBus = (route: any) => {
        return route.directionsResult.routes[0].legs[0].steps.some(
          (step: any) =>
            step.travel_mode === 'TRANSIT' &&
            step.transit?.line?.vehicle?.type === 'BUS'
        );
      };
  
      const aHasBus = hasBus(a);
      const bHasBus = hasBus(b);
  
      if (aHasBus && !bHasBus) return 1;
      if (!aHasBus && bHasBus) return -1;
  
      // If both have or don't have bus, compare total duration
      return (
        a.directionsResult.routes[0].legs[0].duration!.value -
        b.directionsResult.routes[0].legs[0].duration!.value
      );
    } else {
      // Default to comparing total duration
      return (
        a.directionsResult.routes[0].legs[0].duration!.value -
        b.directionsResult.routes[0].legs[0].duration!.value
      );
    }
  }

const isTimeInRange = (hour: number, minute: number, startTime: string, endTime: string) => {
    console.log(startTime, endTime)
    if (startTime ==="all day" || endTime === "all day" || startTime === "-" || endTime === "-") {
        return true;
    }
    const parseTime = (timeString: string) => {
        const [time, period] = timeString.split(/(AM|PM|am|pm)/i);
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period.toLowerCase() === 'pm' && hours !== 12) {
            hours += 12;
        }
        if (period.toLowerCase() === 'am' && hours === 12) {
            hours = 0;
        }
        
        return new Date(0, 0, 0, hours, minutes);
    };
    
    const currentTime = new Date(0, 0, 0, hour, minute);
    const start = parseTime(startTime);
    const end = parseTime(endTime);

    if (start < end) {
        return currentTime >= start && currentTime <= end;
    } else {
        return currentTime >= start || currentTime <= end;
    }
};

export function filter_parking_data(parkingData: ParkingSpotType[], departData: DepartData, permit?: string[]) {
    if (permit) {
        parkingData = parkingData.filter((parkingSpot: any) => {
            if (!isTimeInRange(departData.time!.hour, departData.time!.minute, parkingSpot['Start'], parkingSpot['End'])) {
                return true;
            }
            else if (parkingSpot['Permit holders allowed']) {
                return permit.some((p) => parkingSpot['Permit holders allowed'].toLowerCase().includes(p.toLowerCase()));
            }
            else {
             return false;
            }
        });
    }

 

    
    return parkingData;
}
