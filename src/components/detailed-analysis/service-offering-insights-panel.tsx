// src/components/detailed-analysis/service-offering-insights-panel.tsx

"use client";

import { useEffect, useRef } from "react";
import { useServiceOfferingInsights } from "@/lib/domain/analysis";

interface Props {
    business: string;
    area: string;
    location: string;
    initialInsights?: string;
}

export default function ServiceOfferingInsightsPanel({
    business,
    area,
    location,
    initialInsights,
}: Props) {
    const { insights, getInsights, loading, error } =
        useServiceOfferingInsights();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (
            !initialInsights &&
            !hasFetched.current &&
            business &&
            area &&
            location
        ) {
            hasFetched.current = true;
            getInsights(business, area, location);
        }
    }, [initialInsights, business, area, location, getInsights]);

    const effectiveInsights = initialInsights || insights;

    return (
        <div
            className={`text-xs md:text-sm leading-snug ${
                effectiveInsights ? "text-foreground" : "text-muted-foreground"
            }`}
        >
            {loading && (
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                    <span>Generating service insights...</span>
                </div>
            )}
            {effectiveInsights && !loading && <p>{effectiveInsights}</p>}
            {!effectiveInsights && !loading && (
                <p className="text-xs text-muted-foreground">
                    No offering insights identified for this area.
                </p>
            )}
        </div>
    );
}
