"use client";

import { Icon } from "@/components/icon";
import { TopAreaCard } from "./top-area-card";

interface TopArea {
    name: string;
    score: number;
    saturation: string;
    fit: string;
    competitors: number;
    rent: string;
    traffic: string;
}

interface TopAreasListProps {
    areas: TopArea[];
}

export function TopAreasList({ areas }: TopAreasListProps) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-text-primary-light text-lg font-semibold">
                Top 3 recommended areas by Yelp AI
            </h2>
            <div className="flex flex-col gap-6">
                {areas.map((area, i) => (
                    <TopAreaCard key={i} rank={i + 1} area={area} />
                ))}
            </div>
        </div>
    );
}
