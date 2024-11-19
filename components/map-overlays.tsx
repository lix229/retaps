import { Chip } from "@nextui-org/react";
import { OverlayView } from "@react-google-maps/api";
import React from "react";

export const MemoizedDestinationOverlay = React.memo(({ position, name }: { position: google.maps.LatLngLiteral, name: string }) => (
    <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
        <Chip
            variant="shadow"
            classNames={{
                base: "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white border-white/50 shadow-pink-500/30 z-7",
                content: "drop-shadow shadow    -black text-white",
            }}
            size="lg"
            style={{
                padding: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                transform: 'translate(-50%, -50%)',
            }}
        >
            {name}
        </Chip>
    </OverlayView>
));

export const MemoizedParkingOverlay = React.memo(({ position, name }: { position: google.maps.LatLngLiteral, name: string }) => (
    <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
        <Chip
            color="warning"
            variant="shadow"
            size="lg"
            style={{
                padding: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
            }}
        >
            {name}
        </Chip>
    </OverlayView>
));

export const MemoizedDepartureOverlay = React.memo(({ position }: { position: google.maps.LatLngLiteral }) => (
    <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
        <Chip
            color="primary"
            variant="shadow"
            size="lg"
            style={{
                padding: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
            }}
        >
            Departure
        </Chip>
    </OverlayView>
));

export const MemoizedRouteDurationOverlay = React.memo(({
    position,
    duration,
    theme
}: {
    position: google.maps.LatLngLiteral;
    duration: string;
    theme: string
}) => {
    return (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div
                className={`route-duration-overlay ${theme === 'dark' ? 'dark' : 'light'} w-[70px]`}
                style={{
                    backgroundColor: theme === 'dark' ? '#333' : '#fff',
                    color: theme === 'dark' ? '#fff' : '#000',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    border: `2px solid ${theme === 'dark' ? '#fff' : '#000'}`,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {duration}
            </div>
        </OverlayView>
    );
});
