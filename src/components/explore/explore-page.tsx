"use client";

import { Header } from "@/components/layout/header";
import { AreaDrawer } from "./area-drawer";
import { MapContainerComponent } from "./map-container";
import { useState, useCallback, useEffect, useMemo } from "react";
import { getViewportInfo, getAreaTitleFromCenter } from "@/lib/map-utils";
import { useBusinessAnalysis } from "@/lib/analysis";

interface ExplorePageProps {
    business: string;
    location: string;
}

export function ExplorePage({ business, location }: ExplorePageProps) {
    const [mapInstance, setMapInstance] = useState<any>(null);
    const { result, analyze, loading, metrics, topAreas, competitors } =
        useBusinessAnalysis();

    const handleZoomToHotspot = useCallback(
        (lat: number, lng: number) => {
            if (mapInstance) {
                console.log(
                    `🗺️ Zooming to [${lat.toFixed(4)}, ${lng.toFixed(4)}]`
                );
                mapInstance.setView([lat, lng], 15);
            }
        },
        [mapInstance]
    );

    useEffect(() => {
        if (business && location) {
            console.log(`🔍 Analyzing "${business}" in "${location}"`);
            analyze({ business, location });
        }
    }, [business, location, analyze]);

    const competitorMarkers = useMemo(() => {
        const markers = (competitors || [])
            .filter(
                (c) =>
                    c.coordinates?.latitude &&
                    c.coordinates?.longitude &&
                    !isNaN(c.coordinates.latitude) &&
                    !isNaN(c.coordinates.longitude)
            )
            .map((c) => ({
                id: c.id,
                lat: c.coordinates.latitude,
                lng: c.coordinates.longitude,
                name: c.name,
                rating: c.rating || 0,
            }));
        console.log(
            `📍 ${markers.length}/${competitors.length} VALID competitor markers`
        );
        return markers;
    }, [competitors]);

    const data = useMemo(
        () => ({
            competitors: metrics?.competitors || competitorMarkers.length || 0,
            hotspots: metrics?.hotspots || 0,
            avgRating: metrics?.avgRating || 4.1,
            competitorHotspots: metrics?.competitorHotspots || [],
            topAreas: topAreas.length > 0 ? topAreas : [],
        }),
        [metrics, competitorMarkers.length, topAreas]
    );

    const handleSearchThisArea = useCallback(async () => {
        if (!mapInstance) {
            console.warn("Map not ready");
            return;
        }

        try {
            const viewport = getViewportInfo(mapInstance);
            const areaTitle = await getAreaTitleFromCenter(
                viewport.center.lat,
                viewport.center.lng
            );
            console.log(`🔄 Re-analyzing "${business}" in "${areaTitle}"`);
            analyze({ business, location: areaTitle });
        } catch (error) {
            console.error("Failed to get area info:", error);
        }
    }, [mapInstance, business, analyze]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light">
            <Header />
            <div className="flex flex-1 overflow-hidden relative">
                <AreaDrawer
                    business={business}
                    location={location}
                    data={data}
                    competitors={competitorMarkers}
                    onZoomToHotspot={handleZoomToHotspot}
                    analysisLoading={loading}
                />
                <MapContainerComponent
                    onMapReady={setMapInstance}
                    competitors={competitorMarkers}
                />
                <button
                    onClick={handleSearchThisArea}
                    disabled={!mapInstance || loading}
                    className="absolute top-4 left-1/2 z-[1001] -translate-x-1/2 flex items-center gap-2 rounded-lg bg-white/95 backdrop-blur-md px-6 py-3 text-sm font-semibold text-primary shadow-xl border border-border hover:bg-primary/95 hover:text-primary-foreground hover:border-primary hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    {loading ? "Analyzing..." : "Search this area"}
                </button>
            </div>
        </div>
    );
}
