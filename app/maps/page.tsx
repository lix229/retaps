import DepartDateSelector from "@/components/date-selector";
import { Button } from "@nextui-org/button";
import Upcoming from "@/components/Upcoming";
import MapComponent from "@/components/maps";

const DEBUGGING = false;


export default function MapsPage() {
  return (
    <div className={`flex h-[calc(100vh-150px)] w-full ${DEBUGGING ? "bg-green-200" : ""}`}>
      <div className={`flex flex-row w-full ${DEBUGGING ? "bg-green-200" : ""}`}>
        <div className="flex flex-col items-start space-y-4 p-2">
          <div className="flex items-top space-x-2 w-full">
            <DepartDateSelector />
            <Button
              radius="full"
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg w-[120px] h-[120px] rounded-lg flex flex-col items-center justify-center text-center text-[23px] font-extrabold"
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              Find&nbsp;Me
              <br />
              Parking
            </Button>
          </div>
          <Upcoming />
        </div>

        <div className={`flex flex-col w-full p-2 ${DEBUGGING ? "bg-red-200" : ""} h-full`}>
          <div className={`${DEBUGGING ? "bg-gray-200" : ""} flex-1 w-full`}>
            <MapComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
