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
    competitors: _competitors,
    onZoomToHotspot,
}: HotspotsListProps) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                Competitor hotspots ({hotspots.length})
            </h2>
            <div className="flex flex-col gap-2">
                {hotspots.map((spot, i) => (
                    <HotspotRow
                        key={i}
                        {...spot}
                        onZoom={() => onZoomToHotspot?.(spot.lat, spot.lng)}
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
            type="button"
            onClick={onZoom}
            className="group flex w-full cursor-pointer items-center gap-4 rounded-lg p-3 transition-all hover:bg-secondary/30"
        >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <Icon name="place" className="text-sm" />
            </div>
            <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">
                    {competitors} competitors
                </p>
                <p className="text-xs text-muted-foreground">
                    {rating.toFixed(1)} ★ average
                </p>
            </div>
            <span className="whitespace-nowrap text-sm font-medium text-primary transition-all group-hover:underline">
                Zoom to area →
            </span>
        </button>
    );
}
