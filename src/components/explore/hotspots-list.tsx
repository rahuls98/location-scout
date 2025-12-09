"use client";

import { Icon } from "@/components/icon";

interface Hotspot {
    name: string;
    competitors: number;
    rating: number;
    lat: number;
    lng: number;
}

interface CompetitorMarker {
    id: string | number;
    lat: number;
    lng: number;
    name: string;
    rating: number;
}

interface HotspotsListProps {
    hotspots: Hotspot[];
    competitors: CompetitorMarker[];
    onZoomToHotspot?: (lat: number, lng: number) => void;
}

export function HotspotsList({
    hotspots,
    competitors,
    onZoomToHotspot,
}: HotspotsListProps) {
    const hotspotsWithCoords = hotspots.map((spot) => {
        console.log(`🔍 Processing hotspot "${spot.name}"`);

        // Use pre-computed coords from calculateHotspots (most reliable)
        return {
            ...spot,
            lat: spot.lat,
            lng: spot.lng,
        };
    });

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-text-primary-light text-lg font-semibold flex items-center gap-2">
                Competitor hotspots ({hotspots.length})
            </h2>
            <div className="flex flex-col gap-2">
                {hotspotsWithCoords.map((spot, i) => (
                    <HotspotRow
                        key={i}
                        {...spot}
                        onZoom={() => {
                            console.log(
                                `🔍 Hotspot click: ${spot.name} → [${spot.lat}, ${spot.lng}]`
                            );
                            onZoomToHotspot?.(spot.lat, spot.lng);
                        }}
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
            className="w-full flex items-center gap-4 rounded-lg p-3 hover:bg-secondary/20 transition-all group cursor-pointer"
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
                    {rating.toFixed(1)} ★ Average
                </p>
            </div>
            <span className="text-primary text-sm font-medium whitespace-nowrap group-hover:underline transition-all">
                Zoom to area →
            </span>
        </button>
    );
}
