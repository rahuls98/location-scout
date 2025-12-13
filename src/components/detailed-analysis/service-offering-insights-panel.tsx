// src/components/detailed-analysis/service-offering-insights-panel.tsx
"use client";

import { useEffect, useRef } from "react";
import { useServiceOfferingInsights } from "@/lib/domain/analysis";

export default function ServiceOfferingInsightsPanel({
    business,
    area,
    location,
}: {
    business: string;
    area: string;
    location: string;
}) {
    const { insights, getInsights, loading, error } =
        useServiceOfferingInsights();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current && business && area && location) {
            hasFetched.current = true;
            getInsights(business, area, location);
        }
    }, [business, area, location, getInsights]);

    return (
        <div
            className={`text-xs md:text-sm leading-snug ${
                insights ? "text-foreground" : "text-muted-foreground"
            }`}
        >
            {loading && (
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                    <span>Generating service insights...</span>
                </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {insights && !loading && <p>{insights}</p>}
        </div>
    );
}
