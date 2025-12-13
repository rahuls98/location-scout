"use client";

import dynamic from "next/dynamic";

interface MapContainerProps {
    onMapReady?: (map: any) => void;
    competitors: Array<{
        id: string | number;
        lat: number;
        lng: number;
        name: string;
        rating: number;
    }>;
}

const MapLeafletNoSSR = dynamic(() => import("./map-leaflet"), {
    ssr: false,
    loading: () => <div className="h-full rounded-lg bg-muted animate-pulse" />,
});

export function MapContainerComponent({
    onMapReady,
    competitors,
}: MapContainerProps) {
    return (
        <div className="h-full w-full rounded-md border border-border overflow-hidden">
            {" "}
            <main className="h-full w-full relative min-h-0 flex-1">
                {" "}
                <MapLeafletNoSSR
                    competitors={competitors}
                    onMapReady={onMapReady}
                />
            </main>
        </div>
    );
}
