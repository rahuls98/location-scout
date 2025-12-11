// src/app/(analysis)/analysis/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MissingParameters } from "../missing-parameters";
import { LoadingScreen } from "../loading-screen";
import { NoResults } from "../no-results";
import { AnalysisPage } from "@/components/analysis/analysis-page";
import { useAnalysis } from "@/lib/domain/analysis";

function makeAnalysisId(business: string, location: string) {
    return `analysis:${business.trim().toLowerCase()}::${location
        .trim()
        .toLowerCase()}`;
}

export default function AnalysisRoute() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const business = searchParams.get("business");
    const location = searchParams.get("location");

    if (!business || !location) {
        return <MissingParameters />;
    }

    const analysisId = useMemo(
        () => makeAnalysisId(business, location),
        [business, location]
    );

    const { loading, result, analyze } = useAnalysis(analysisId);

    // Only trigger analysis if no cached result for this id
    useEffect(() => {
        if (!result) {
            analyze({ business, location });
        }
    }, [analyze, business, location, result]);

    if (loading && !result) {
        return <LoadingScreen business={business} location={location} />;
    }

    if (!result || result.competitors.length === 0) {
        return <NoResults />;
    }

    return (
        <AnalysisPage
            business={business}
            location={location}
            analyze={analyze}
            metrics={result.metrics}
            topAreas={result.topAreas}
            competitors={result.competitors}
        />
    );
}
