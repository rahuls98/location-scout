// src/components/analysis/analysis-page.tsx
"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { AreaDrawer } from "@/components/analysis/area-drawer";
import { MapContainerComponent } from "@/components/map-container";
import { getViewportInfo, getAreaTitleFromCenter } from "@/lib/maps/utils";
import type { SummaryMetrics, TopArea, YelpBusiness } from "@/lib/domain/types";

interface CompetitorMarker {
    id: string;
    lat: number;
    lng: number;
    name: string;
    rating: number;
}

interface AnalysisPageProps {
    business: string;
    location: string;
    analyze: (input: { business: string; location: string }) => void;
    metrics: SummaryMetrics;
    topAreas: TopArea[];
    competitors: YelpBusiness[];
}

export function AnalysisPage({
    business,
    location,
    analyze,
    metrics,
    topAreas,
    competitors,
}: AnalysisPageProps) {
    const [mapInstance, setMapInstance] = useState<any>(null);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleZoomToArea = useCallback(
        (lat: number, lng: number, zoomLevel: number = 15) => {
            if (!mapInstance) return;
            mapInstance.setView([lat, lng], zoomLevel);
        },
        [mapInstance]
    );

    // Zoom to first competitor hotspot on load (highest competitors count)
    useEffect(() => {
        if (!mapInstance || !metrics.competitorHotspots.length) return;

        const sortedHotspots = [...metrics.competitorHotspots].sort(
            (a, b) => b.competitors - a.competitors
        );
        const firstHotspot = sortedHotspots[0];

        mapInstance.setView([firstHotspot.lat, firstHotspot.lng], 15);
    }, [mapInstance, metrics.competitorHotspots]);

    const competitorMarkers: CompetitorMarker[] = useMemo(() => {
        const valid = competitors.filter(
            (c) =>
                c.coordinates?.latitude != null &&
                c.coordinates?.longitude != null &&
                !Number.isNaN(c.coordinates.latitude) &&
                !Number.isNaN(c.coordinates.longitude)
        );

        return valid.map((c) => ({
            id: c.id,
            lat: c.coordinates.latitude,
            lng: c.coordinates.longitude,
            name: c.name,
            rating: c.rating || 0,
        }));
    }, [competitors]);

    // Sort topAreas by score descending
    const sortedTopAreas = useMemo(() => {
        return [...topAreas].sort((a, b) => (b.score || 0) - (a.score || 0));
    }, [topAreas]);

    const data = useMemo(
        () => ({
            competitors: metrics.competitors,
            analyzedCount: competitors.length,
            hotspots: metrics.hotspots,
            avgRating: metrics.avgRating,
            competitorHotspots: metrics.competitorHotspots,
            topAreas: sortedTopAreas,
        }),
        [metrics, competitors.length, sortedTopAreas]
    );

    const handleSearchThisArea = useCallback(async () => {
        if (!mapInstance) return;

        try {
            const viewport = getViewportInfo(mapInstance);
            const areaTitle = await getAreaTitleFromCenter(
                viewport.center.lat,
                viewport.center.lng
            );

            // Smooth transition to loading state
            startTransition(async () => {
                // Update URL first
                router.replace(
                    `?business=${encodeURIComponent(
                        business
                    )}&location=${encodeURIComponent(areaTitle)}`
                );

                // Trigger analysis
                analyze({ business, location: areaTitle });
            });
        } catch (error) {
            console.error("Failed to update area from viewport:", error);
        }
    }, [mapInstance, business, analyze, router, startTransition]);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            <Header />
            <div className="relative flex flex-1 overflow-hidden">
                <AreaDrawer
                    business={business}
                    location={location}
                    data={data}
                    competitors={competitorMarkers}
                    onZoomToArea={handleZoomToArea}
                    analysisLoading={isPending}
                />
                <MapContainerComponent
                    onMapReady={setMapInstance}
                    competitors={competitorMarkers}
                />
                <button
                    type="button"
                    onClick={handleSearchThisArea}
                    disabled={!mapInstance || isPending}
                    className="hidden md:flex absolute right-0 top-4 z-[1001] flex -translate-x-1/2 items-center gap-2 rounded-lg border border-border bg-card/95 px-4 py-2 text-sm font-semibold text-primary shadow-lg backdrop-blur-md transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                    <svg
                        className="h-4 w-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <span>Search this area</span>
                </button>
            </div>
        </div>
    );
}
