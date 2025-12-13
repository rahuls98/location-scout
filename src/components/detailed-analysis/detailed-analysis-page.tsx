// src/components/detailed-analysis/detailed-analysis-page.tsx
"use client";

import "leaflet/dist/leaflet.css";
import { Header } from "../layout/header";
import { MapContainerComponent } from "@/components/map-container";
import CompetitorReviewInsightsPanel from "./competitor-review-insights-panel";
import ServiceOfferingsInsightPanel from "./service-offering-insights-panel";
import { useCallback, useEffect, useState } from "react";

type Demographic = {
    type: string;
    value: string;
};

type Traffic = {
    weekday?: string;
    weekend?: string;
    peak_hours?: string;
};

type Competitor = {
    name: string;
    rating?: number;
    reviews?: number;
    price?: string | null;
    url?: string | null;
    price_per_sqft?: number | null;
};

type Gap = {
    title?: string;
    description?: string;
};

type DetailedAnalysisData = {
    name: string;
    competitors: Competitor[];
    demographics: Demographic[];
    gaps: Gap[];
    traffic?: Traffic;
    success_factors: string[];
};

type Props = {
    business: string;
    location: string;
    area: string;
    data: DetailedAnalysisData;
};

export default function DetailedAnalysisPage({
    business,
    location,
    area,
    data,
}: Props) {
    const demographics = data.demographics ?? [];
    const competitors = data.competitors ?? [];
    const gaps = data.gaps ?? [];
    const traffic = data.traffic;
    const success_factors = data.success_factors ?? [];

    const topCompetitors = competitors.slice(0, 5);
    const topSuccessFactors = success_factors.slice(0, 3);

    const hasDemographics = demographics.length > 0;
    const hasTraffic = !!traffic;
    const hasGaps = gaps.length > 0;

    const [mapInstance, setMapInstance] = useState<any>(null);

    const centerMap = useCallback((map: any) => {
        map.setView([42.3876, -71.0995], 15);
    }, []);

    useEffect(() => {
        if (mapInstance) {
            centerMap(mapInstance);
        }
    }, [mapInstance, centerMap]);

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1 px-3 py-4 md:px-4 md:py-5 lg:px-5 lg:py-6">
                <div className="w-full">
                    {/* Header / Intro */}
                    <div className="pb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">
                                Detailed market analysis
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                <strong>{business}</strong> in and around{" "}
                                <strong>{area}</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-3">
                        {/* Row 1 */}
                        {/* Location map – dummy layout */}
                        <section className="flex flex-col gap-2 rounded-lg border border-border bg-card px-3 py-3.5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">
                                        map
                                    </span>
                                    <h2 className="text-sm font-semibold leading-tight">
                                        Location map
                                    </h2>
                                </div>
                            </div>
                            <div className="h-60 w-full rounded-md border border-border">
                                <MapContainerComponent
                                    onMapReady={setMapInstance}
                                    competitors={[]}
                                />
                            </div>
                        </section>

                        {/* Overview & demographics – unified list style */}
                        <section className="flex flex-col rounded-lg border border-border bg-card px-3 py-3.5 shadow-sm">
                            <div className="mb-1.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">
                                        insights
                                    </span>
                                    <h2 className="text-sm font-semibold leading-tight">
                                        Overview &amp; demographics
                                    </h2>
                                </div>
                            </div>

                            {hasDemographics ? (
                                <ul className="divide-y divide-border rounded-md">
                                    {demographics.map((demo, i) => (
                                        <li key={i} className="px-3 py-2.5">
                                            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                                                {demo.type}
                                            </p>
                                            <p className="mt-0.5 text-xs md:text-sm leading-snug">
                                                {demo.value}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    No demographic details available for this
                                    area.
                                </p>
                            )}
                        </section>

                        {/* Foot traffic – unified list style using traffic JSON */}
                        <section className="flex flex-col rounded-lg border border-border bg-card px-3 py-3.5 shadow-sm">
                            <div className="mb-1.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">
                                        directions_walk
                                    </span>
                                    <h2 className="text-sm font-semibold leading-tight">
                                        Foot traffic
                                    </h2>
                                </div>
                            </div>

                            {hasTraffic ? (
                                <ul className="divide-y divide-border rounded-md">
                                    {traffic?.weekday && (
                                        <li className="px-3 py-2.5">
                                            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                                                Weekdays
                                            </p>
                                            <p className="mt-0.5 text-xs md:text-sm leading-snug">
                                                {traffic.weekday}
                                            </p>
                                        </li>
                                    )}
                                    {traffic?.weekend && (
                                        <li className="px-3 py-2.5">
                                            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                                                Weekends
                                            </p>
                                            <p className="mt-0.5 text-xs md:text-sm leading-snug">
                                                {traffic.weekend}
                                            </p>
                                        </li>
                                    )}
                                    {traffic?.peak_hours && (
                                        <li className="px-3 py-2.5">
                                            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                                                Peak hours
                                            </p>
                                            <p className="mt-0.5 text-xs md:text-sm leading-snug">
                                                {traffic.peak_hours}
                                            </p>
                                        </li>
                                    )}
                                </ul>
                            ) : (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    No foot traffic details available for this
                                    area.
                                </p>
                            )}
                        </section>

                        {/* Row 2 */}
                        {/* Top competitors – unified list style */}
                        <section className="rounded-lg border border-border bg-card px-3 py-3.5 shadow-sm">
                            <div className="mb-1.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">
                                        storefront
                                    </span>
                                    <h2 className="text-sm font-semibold leading-tight">
                                        Top competitors
                                    </h2>
                                </div>
                            </div>

                            {topCompetitors.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    No competitors found for this area.
                                </p>
                            ) : (
                                <ul className="divide-y divide-border rounded-md text-xs md:text-sm">
                                    {topCompetitors.map((comp, idx) => (
                                        <li
                                            key={`${comp.name}-${idx}`}
                                            className="flex items-center justify-between px-3 py-2.5"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {comp.name}
                                                </span>
                                                <span className="mt-0.5 text-[11px] text-muted-foreground">
                                                    {comp.price || "$"} ·{" "}
                                                    {comp.reviews ?? 0} reviews
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end text-[11px] text-muted-foreground">
                                                {comp.rating != null && (
                                                    <span className="flex items-center gap-0.5">
                                                        {comp.rating.toFixed(1)}
                                                        <span aria-hidden="true">
                                                            ★
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Market gaps – unified list style */}
                        <section className="rounded-lg border border-border bg-card px-3 py-3.5 shadow-sm">
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-primary">
                                    lightbulb
                                </span>
                                <h2 className="text-sm font-semibold leading-tight">
                                    Market gaps
                                </h2>
                            </div>

                            {hasGaps ? (
                                <ul className="divide-y divide-border rounded-md text-xs md:text-sm">
                                    {gaps.slice(0, 5).map((gap, i) => (
                                        <li key={i} className="px-3 py-2.5">
                                            <p className="font-medium">
                                                {gap.title || "Opportunity"}
                                            </p>
                                            {gap.description && (
                                                <p className="mt-0.5 text-[11px] md:text-xs text-muted-foreground leading-snug">
                                                    {gap.description}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    No clear market gaps identified for this
                                    area.
                                </p>
                            )}
                        </section>

                        {/* Competitor review insights */}
                        <section className="flex flex-col rounded-lg border border-border bg-card px-3 py-3.5 shadow-sm">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-primary">
                                    reviews
                                </span>
                                <h2 className="text-sm font-semibold leading-tight">
                                    Competitor review insights
                                </h2>
                            </div>

                            <CompetitorReviewInsightsPanel
                                business={business}
                                area={area}
                                location={location}
                            />
                        </section>

                        {/* Row 3 */}
                        {/* Top keys to success – unified list style */}
                        <section className="rounded-lg border border-border bg-card px-3 py-3.5 shadow-sm">
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-primary">
                                    checklist
                                </span>
                                <h2 className="text-sm font-semibold leading-tight">
                                    Top keys to success
                                </h2>
                            </div>

                            {topSuccessFactors.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    No specific success factors identified for
                                    this area.
                                </p>
                            ) : (
                                <ul className="divide-y divide-border rounded-md text-xs md:text-sm">
                                    {topSuccessFactors.map((factor, i) => (
                                        <li
                                            key={i}
                                            className="px-3 py-2.5 leading-snug"
                                        >
                                            {factor}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Service offering insights */}
                        <section className="lg:col-span-2 rounded-lg border border-border bg-card px-3 py-3.5 shadow-sm">
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-primary">
                                    grade
                                </span>
                                <h2 className="text-sm font-semibold leading-tight">
                                    Service offering insights
                                </h2>
                            </div>
                            <ServiceOfferingsInsightPanel
                                business={business}
                                area={area}
                                location={location}
                            />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
