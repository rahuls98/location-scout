"use client";

import { Icon } from "@/components/icon";

interface Hotspot {
    name: string;
    competitors: number;
    rating: number;
    lat?: number;
    lng?: number;
}

interface HotspotsListProps {
    hotspots: Hotspot[];
    onZoomToHotspot?: (lat: number, lng: number) => void;
}

export function HotspotsList({ hotspots, onZoomToHotspot }: HotspotsListProps) {
    // Map your data to include coordinates (matching map clusters)
    const hotspotsWithCoords = hotspots.map((spot, index) => ({
        ...spot,
        lat: [45.52, 45.53, 45.51][index] || 45.52,
        lng: [-122.67, -122.66, -122.68][index] || -122.67,
    }));

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-text-primary-light text-lg font-semibold flex items-center gap-2">
                Competitor hotspots
            </h2>
            <div className="flex flex-col gap-2">
                {hotspotsWithCoords.map((spot, i) => (
                    <HotspotRow
                        key={i}
                        {...spot}
                        onZoom={() => onZoomToHotspot?.(spot.lat!, spot.lng!)}
                    />
                ))}
            </div>
        </div>
    );
}

function HotspotRow({
    name,
    competitors,
    rating,
    onZoom,
}: Hotspot & { onZoom: () => void }) {
    return (
        <button
            onClick={onZoom}
            className="w-full flex items-center gap-4 rounded-lg p-3 hover:bg-secondary/20 transition-all group"
        >
            <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-10 shrink-0 group-hover:scale-105 transition-transform">
                <Icon name="place" className="text-sm" />
            </div>
            <div className="flex-1 text-left">
                <p className="text-text-primary-light text-sm font-medium">
                    {name}
                </p>
                <p className="text-text-secondary-light text-xs">
                    {competitors} Competitors
                </p>
                <p className="text-text-secondary-light text-xs">
                    {rating} ★ Average Rating
                </p>
            </div>
            <span className="text-primary text-sm font-medium whitespace-nowrap group-hover:underline transition-all">
                Zoom to area →
            </span>
        </button>
    );
}
