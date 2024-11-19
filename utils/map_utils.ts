import { DepartData, ParkingSpotType } from "@/types/locations";
import { parking_data_football } from "@/data/parking_data_football";
import { DateValue } from "@nextui-org/react";

export function compare_routes(a: any, b: any, preference: string) {
  if (preference === 'faster') {
      return (a.totalDuration || 0) - (b.totalDuration || 0);
  } else if (preference === 'walk_less') {
      const getWalkingDuration = (route: any) => {
          return route.directionsResult.routes[0].legs[0].steps
              .filter((step: any) => step.travel_mode === 'WALKING')
              .reduce((sum: number, step: any) => sum + step.duration.value, 0);
      };

      const aWalkingDuration = getWalkingDuration(a);
      const bWalkingDuration = getWalkingDuration(b);

      return aWalkingDuration - bWalkingDuration;
  } else if (preference === 'drive_less') {
      // Get driving duration (0 if no driving directions)
      const getDrivingDuration = (route: any) => {
          return route.drivingDirections?.routes[0]?.legs[0]?.duration?.value || 0;
      };

      const aDrivingDuration = getDrivingDuration(a);
      const bDrivingDuration = getDrivingDuration(b);

      // If driving durations are significantly different, prioritize less driving
      if (Math.abs(aDrivingDuration - bDrivingDuration) > 60) { 
          return aDrivingDuration - bDrivingDuration;
      }

      // If driving times are similar, consider total duration as tiebreaker
      return (a.totalDuration || 0) - (b.totalDuration || 0);
  } else if (preference === 'less_transit') {
      // Get transit/walking duration after parking
      const getTransitDuration = (route: any) => {
          return route.directionsResult.routes[0].legs[0].duration.value;
      };

      const aTransitDuration = getTransitDuration(a);
      const bTransitDuration = getTransitDuration(b);

      // If transit durations are significantly different, prioritize less transit time
      if (Math.abs(aTransitDuration - bTransitDuration) > 60) { 
          return aTransitDuration - bTransitDuration;
      }

      // If transit times are similar, consider total duration as tiebreaker
      return (a.totalDuration || 0) - (b.totalDuration || 0);
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

      return (a.totalDuration || 0) - (b.totalDuration || 0);
  } else {
      // Default to comparing total duration
      return (a.totalDuration || 0) - (b.totalDuration || 0);
  }
}

const isTimeInRange = (hour: number, minute: number, startTime: string, endTime: string) => {
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
    const isFootballGame = parking_data_football.some(gameDay => {
        if (!departData.date) return false;
        const [year, month, day] = gameDay.date.split('.').map(Number);
        return departData.date.year === year && 
              departData.date.month === month && 
              departData.date.day === day;
    });
    if (permit) {

        parkingData = parkingData.filter((parkingSpot: any) => {
            if (!isFootballGame && !isTimeInRange(departData.time!.hour, departData.time!.minute, parkingSpot['Start'], parkingSpot['End'])) {
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


export const isFootballGameDate = (date: DateValue) => {
    return parking_data_football.some(gameDay => {
        const [year, month, day] = gameDay.date.split('.').map(Number);
        return date.year === year &&
            date.month === month &&
            date.day === day;
    });
};

export const getFootballGameData = (date: DateValue) => {
  return parking_data_football.find(gameDay => {
      const [year, month, day] = gameDay.date.split('.').map(Number);
      return date.year === year &&
          date.month === month &&
          date.day === day;
  });
};