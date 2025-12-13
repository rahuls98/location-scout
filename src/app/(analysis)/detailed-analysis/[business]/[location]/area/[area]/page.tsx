// src/app/(analysis)/[business]/[location]/area/[area]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { MissingParameters } from "@/app/(analysis)/missing-parameters";
import { LoadingScreen } from "@/app/(analysis)/loading-screen";
import { NoResults } from "@/app/(analysis)/no-results";
import DetailedAnalysisPage from "@/components/detailed-analysis/detailed-analysis-page";
import { useDetailedAnalysis } from "@/lib/domain/analysis";
import type { DetailedAreaData } from "@/lib/domain/types";

export default function DetailedAnalysisRoute() {
    const params = useParams<{
        business?: string;
        location?: string;
        area?: string;
    }>();
    const searchParams = useSearchParams();

    const business = params.business;
    const location = params.location;
    const area = params.area;
    const latitude = Number(searchParams.get("latitude"));
    const longitude = Number(searchParams.get("longitude"));

    if (!business || !location || !area || !latitude || !longitude) {
        return <MissingParameters />;
    }

    const { loading, error, data, loadDetailedArea } = useDetailedAnalysis();

    useEffect(() => {
        if (data) return;

        loadDetailedArea({
            business: decodeURIComponent(business),
            location: decodeURIComponent(location),
            area: decodeURIComponent(area),
        });
    }, [business, location, area, loadDetailedArea]);

    if (loading) {
        return (
            <LoadingScreen
                business={decodeURIComponent(business)}
                location={`and around ${decodeURIComponent(area)}`}
            />
        );
    }

    if (error || !data) {
        return <NoResults />;
    }

    return (
        <DetailedAnalysisPage
            data={data as DetailedAreaData}
            business={decodeURIComponent(business)}
            location={decodeURIComponent(location)}
            area={decodeURIComponent(area)}
            coords={[latitude, longitude]}
        />
    );
}
