"use client";

import { Header } from "@/components/layout/header";
import { AreaDrawer } from "./area-drawer";
import { MapContainerComponent } from "./map-container";
import { useState, useCallback } from "react"; // Add useCallback

interface ExplorePageProps {
    business: string;
    location: string;
}

export function ExplorePage({ business, location }: ExplorePageProps) {
    const [mapInstance, setMapInstance] = useState<any>(null);

    // ✅ FIXED: useCallback instead of useState
    const handleZoomToHotspot = useCallback(
        (lat: number, lng: number) => {
            if (mapInstance) {
                mapInstance.setView([lat, lng], 15);
            }
        },
        [mapInstance]
    );

    // Your existing data...
    const data = {
        competitors: 52,
        hotspots: 4,
        avgRating: 4.1,
        competitorHotspots: [
            { name: "Downtown cluster", competitors: 17, rating: 4.3 },
            { name: "Pearl District", competitors: 12, rating: 4.5 },
            { name: "SE Division St", competitors: 9, rating: 4.0 },
        ],
        topAreas: [
            {
                name: "SE Portland",
                score: 8.4,
                saturation: "Low",
                fit: "Perfect",
                competitors: 2,
                gaps: ["No premium artisanal coffee", "No quiet workspace"],
                rent: "$3,500-5,500/mo",
                traffic: "High",
            },
            {
                name: "Alberta Arts District",
                score: 7.2,
                saturation: "Medium",
                fit: "Good",
                competitors: 12,
                gaps: ["High foot traffic", "Vibrant community"],
                rent: "$4k–6k/mo",
                traffic: "Very High",
            },
            {
                name: "Slabtown",
                score: 6.0,
                saturation: "Low",
                fit: "Moderate",
                competitors: 9,
                gaps: ["Emerging market", "New residential"],
                rent: "$3k–4.5k/mo",
                traffic: "Medium",
            },
        ],
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <AreaDrawer
                    business={business}
                    location={location}
                    data={data}
                    onZoomToHotspot={handleZoomToHotspot}
                />
                <MapContainerComponent onMapReady={setMapInstance} />
            </div>
        </div>
    );
}
