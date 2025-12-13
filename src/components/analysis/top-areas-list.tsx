"use client";

import { TopArea } from "@/lib/domain/types";
import { TopAreaCard } from "./top-area-card";

interface TopAreasListProps {
    areas: TopArea[];
    business: string;
    location: string;
    onZoomToArea: (lat: number, lng: number, zoomLevel: number) => void;
}

export function TopAreasList({
    areas,
    business,
    location,
    onZoomToArea,
}: TopAreasListProps) {
    if (!areas?.length) return null;

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-foreground">
                Top areas recommended by Yelp AI
            </h2>
            <div className="flex flex-col gap-4">
                {areas.map((area, i) => (
                    <TopAreaCard
                        key={area.name ?? i}
                        rank={i + 1}
                        area={area}
                        business={business}
                        location={location}
                        onZoomToArea={onZoomToArea}
                    />
                ))}
            </div>
        </div>
    );
}
