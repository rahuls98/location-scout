"use client";

import { Icon } from "@/components/icon";
import { SummaryCard } from "./summary-card";
import { HotspotsList } from "./hotspots-list";
import { TopAreasList } from "./top-areas-list";

interface CompetitorMarker {
    id: string | number;
    lat: number;
    lng: number;
    name: string;
    rating: number;
}

interface AreaDrawerProps {
    business: string;
    location: string;
    data: {
        competitors: number;
        hotspots: number;
        avgRating: number;
        competitorHotspots: any[];
        topAreas: any[];
    };
    competitors: CompetitorMarker[];
    onZoomToHotspot: (lat: number, lng: number) => void;
    analysisLoading: boolean;
}

export function AreaDrawer({
    business,
    location,
    data,
    competitors,
    onZoomToHotspot,
    analysisLoading,
}: AreaDrawerProps) {
    return (
        <aside className="flex h-full w-full max-w-[500px] flex-shrink-0 flex-col border-r border-border bg-card shadow-xl">
            <div className="flex h-full flex-col overflow-hidden">
                <div className="sticky top-0 z-10 flex-shrink-0 border-b border-border bg-card/95 p-6 shadow-sm backdrop-blur">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg border bg-primary px-4 py-2 text-xs text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                    >
                        ← Change search
                    </a>
                    <div>
                        <br />
                        <h1 className="text-base font-semibold leading-tight text-foreground md:text-lg">
                            {business} in {location}
                        </h1>
                    </div>
                </div>

                <div className="flex-1 space-y-8 overflow-y-auto px-6 pb-24 pt-6">
                    {analysisLoading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-20 rounded-lg bg-muted" />
                            <div className="h-24 rounded-lg bg-muted" />
                            <div className="h-28 rounded-lg bg-muted" />
                        </div>
                    ) : (
                        <>
                            <SummaryCard
                                competitors={data.competitors}
                                hotspots={data.hotspots}
                                avgRating={data.avgRating}
                            />
                            <hr className="border-border" />
                            <HotspotsList
                                hotspots={data.competitorHotspots}
                                competitors={competitors}
                                onZoomToHotspot={onZoomToHotspot}
                            />
                            <hr className="border-border" />
                            <TopAreasList
                                areas={data.topAreas}
                                business={business}
                                location={location}
                            />
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
