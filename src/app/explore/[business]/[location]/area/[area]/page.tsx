// src/app/(explore)/[business]/[location]/area/[area]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DetailedAreaPage } from "@/components/explore/detailed-area-page";
import { getTopAreaData } from "@/lib/analysis";
import { DetailedAreaData } from "@/lib/analysis/types";

export default function DetailedAreaPageRoute() {
    const params = useParams();
    const [data, setData] = useState<DetailedAreaData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);
                const result = await getTopAreaData({
                    business: params.business as string,
                    location: params.location as string,
                    area: params.area as string,
                });
                setData(result);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load analysis"
                );
                console.error("Area analysis error:", err);
            } finally {
                setLoading(false);
            }
        }

        if (params.business && params.location && params.area) {
            loadData();
        }
    }, [params.business, params.location, params.area]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg">Analyzing {params.area}...</p>
                    <p className="text-muted-foreground mt-2">
                        Loading detailed market data
                    </p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-8">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-destructive">
                        Analysis Unavailable
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {error || "No data available for this area"}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Retry Analysis
                    </button>
                </div>
            </div>
        );
    }

    return <DetailedAreaPage data={data} />;
}
