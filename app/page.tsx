import DepartDateSelector from "@/components/date-selector";
import { Button } from "@nextui-org/button";
import Upcoming from "@/components/Upcoming";
import Feed from "@/components/Feed";
import MapComponent from "@/components/maps";

const DEBUGGING = false;


export default function Home() {
  return (
    <div className={`flex flex-col h-[calc(100vh-90px)] items-center w-auto ${DEBUGGING ? "bg-green-200" : ""}`}>
      <p className="text-inherit text-[250px] font-billion-dreams">
        ReTaps
      </p>
      <p style={{ fontFamily: 'Palatino, Palatino Linotype, serif' }}>
        Redefining the way transportation works on campus
      </p>
    </div>
  );
}
