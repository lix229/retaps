"use client";

import DepartDateSelector from "@/components/date-selector";
import { Button } from "@nextui-org/button";
import Upcoming from "@/components/Upcoming";
import Feed from "@/components/Feed";
import MapComponent from "@/components/maps";


import { Link } from "@nextui-org/link";
import {Card, CardHeader, CardBody, Image} from '@nextui-org/react';
import React from "react";
import {useHover} from "react-aria";

const DEBUGGING = false;

export default function Home() {
    const {hoverProps: hoverPropsImage1, isHovered: isHoveredImage1} = useHover({});
    const {hoverProps: hoverPropsImage2, isHovered: isHoveredImage2} = useHover({});
  return (
    <div className = "grid grid-rows-[1fr_3fr] grid-cols-2 h-[calc(100vh-90px)] w-full">
      {/* <div className={`flex flex-col h-[calc(100vh-90px)] items-center w-auto ${DEBUGGING ? "bg-green-200" : ""}`}>
        <p className="text-inherit text-[250px] font-billion-dreams">
          ReTaps
        </p>
        <p style={{ fontFamily: 'Palatino, Palatino Linotype, serif' }}>
          Redefining the way transportation works on campus
        </p>
      </div> */}

      <div className={`flex flex-col col-span-2 h-full w-full items-center w-auto ${DEBUGGING ? "bg-green-200" : ""}`}>
        <p className="text-inherit text-[150px] text-center font-billion-dreams">
           ReTaps 
        </p>
        <p className = "text-center" style={{ fontFamily: 'Palatino, Palatino Linotype, serif' }}>
          ~ Redefining transportation on campus ~
        </p>
      </div>

      <div className = "border-8 border-black p-4 col-span-2 grid grid-cols-2 gap-10"> 
        
        <div {...hoverPropsImage1} className="flex h-full w-full">
          <Link href = '/maps'>
            <Card className="w-full h-full relative" isPressable>
              <div className = "relative w-full h-full">
                <Image
                  removeWrapper
                  isZoomed
                  alt = "Route Planning"
                  className = "w-full h-full object-cover rounded-none"
                  style = {{opacity: isHoveredImage1 ? 1 : 0.2}}
                  src = "/assets/parking_image.jpg"
                />

                <CardHeader className="absolute top-3 flex-col card-header">
                  <h1 style = {{
                        fontSize: "48px", 
                        fontWeight: "bold", 
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                        marginBottom: "10px",
                        lineHeight: "1.2",
                        color : isHoveredImage1 ? "white" : "black",
                        fontFamily: 'Palatino, Palatino Linotype, serif'
                        }} 
                      className="uppercase text-black text-center"
                  > Route Planning 
                  </h1>
                  <h4 style = {{
                        fontSize: "36px", 
                        textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
                        marginTop: "10px",
                        lineHeight: "1.2",
                        color: isHoveredImage1 ? "white" : "black",
                        fontFamily: 'Palatino, Palatino Linotype, serif'
                        }} 
                      className="text-center"
                  > Create commute plan with best available parking spaces 
                  </h4>
                </CardHeader>

              </div>
            </Card>
          </Link>
        </div>

        <div {...hoverPropsImage2} className="flex h-full w-full">
          <Link href = '/login'>
            <Card className="w-full h-full relative rounded-lg" isPressable>
              <div className = "relative w-full h-full">
                <Image
                  removeWrapper
                  isZoomed
                  alt = "Parking Permits"
                  className = "w-full h-full object-cover rounded-none"
                  style = {{opacity: isHoveredImage2 ? 1 : 0.2}}
                  src = "/assets/sign_image.jpg"
                />
                
                <CardHeader className="absolute top-3 flex-col card-header">
                  <h1 style = {{
                        fontSize: "48px", 
                        fontWeight: "bold", 
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                        marginBottom: "10px",
                        lineHeight: "1.2",
                        color: isHoveredImage2 ? "white" : "black",
                        fontFamily: 'Palatino, Palatino Linotype, serif'
                        }} 
                      className="uppercase text-black text-center"
                  > Parking Permits 
                  </h1>
                  <h4 style = {{
                        fontSize: "36px", 
                        textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
                        marginTop: "10px",
                        lineHeight: "1.2",
                        color: isHoveredImage2 ? "white" : "black",
                        fontFamily: 'Palatino, Palatino Linotype, serif'
                        }} 
                      className="text-center"
                  > Manage parking decals & citations
                  </h4>
                </CardHeader>

              </div>
            </Card>
          </Link>
        </div>
      </div>
  
    </div>
  );
}
