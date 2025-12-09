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
    data: any;
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
    analysisLoading = false,
}: AreaDrawerProps) {
    return (
        <aside className="flex h-full w-full max-w-[500px] flex-shrink-0 flex-col border-r border-border-light bg-surface-light shadow-xl">
            <div className="flex flex-col h-full overflow-hidden">
                <div className="sticky top-0 z-50 bg-surface-light border-b border-border-light shadow-sm p-6 shrink-0">
                    <div className="flex items-center gap-4 mb-4">
                        <button className="flex size-10 items-center justify-center rounded-lg text-text-secondary-light hover:bg-gray-100 transition-all">
                            <Icon
                                name="arrow_back_ios_new"
                                className="text-xl"
                            />
                        </button>
                        <p className="text-text-primary-light text-base font-medium flex-1 truncate hover:underline cursor-pointer">
                            Change search
                        </p>
                    </div>
                    <div className="pb-2">
                        <h1 className="text-text-primary-light text-xl font-bold leading-tight">
                            {business} in {location}
                        </h1>
                        <p className="text-text-secondary-light text-sm mt-1">
                            {analysisLoading
                                ? "🔍 Analyzing market data..."
                                : `${data.competitors || 0} competitors found`}
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
                    {analysisLoading ? (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                            <div className="h-32 bg-gray-200 rounded-lg"></div>
                            <div className="h-40 bg-gray-200 rounded-lg"></div>
                        </div>
                    ) : (
                        <>
                            <SummaryCard
                                competitors={data.competitors}
                                hotspots={data.hotspots}
                                avgRating={data.avgRating}
                            />
                            <hr />
                            <HotspotsList
                                hotspots={data.competitorHotspots}
                                competitors={competitors}
                                onZoomToHotspot={onZoomToHotspot}
                            />
                            <hr />
                            <TopAreasList areas={data.topAreas} />
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
