"use client";

import { TopArea } from "@/lib/ai/types";
import { TopAreaCard } from "./top-area-card";

interface TopAreasListProps {
    areas: TopArea[];
    business: string;
    location: string;
}

export function TopAreasList({ areas, business, location }: TopAreasListProps) {
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
                    />
                ))}
            </div>
        </div>
    );
}
