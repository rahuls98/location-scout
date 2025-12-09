import { TopArea } from "./types";
import {
    AnalysisInput,
    AnalysisResult,
    SummaryMetrics,
    DetailedAreaData,
} from "./types";
import { searchCompetitors, searchTopAreasAI } from "./yelp";

function calculateHotspots(businesses: any[]): {
    name: string;
    competitors: number;
    rating: number;
    lat: number;
    lng: number;
}[] {
    const neighborhoods = businesses.reduce(
        (acc: Record<string, any[]>, business) => {
            const neighborhood =
                business.location.neighborhood?.[0] ||
                business.location.city ||
                "City Center";
            if (!acc[neighborhood]) acc[neighborhood] = [];
            acc[neighborhood].push(business);
            return acc;
        },
        {}
    );

    return Object.entries(neighborhoods)
        .map(([name, businesses]) => {
            // ✅ Filter VALID coordinates only
            const validCoords = businesses
                .map((b: any) => b.coordinates)
                .filter(
                    (c: any) =>
                        c?.latitude &&
                        c?.longitude &&
                        !isNaN(c.latitude) &&
                        !isNaN(c.longitude)
                );

            const validCount = validCoords.length;

            const avgLat =
                validCount > 0
                    ? validCoords.reduce(
                          (sum: number, c: any) => sum + c.latitude,
                          0
                      ) / validCount
                    : 0;
            const avgLng =
                validCount > 0
                    ? validCoords.reduce(
                          (sum: number, c: any) => sum + c.longitude,
                          0
                      ) / validCount
                    : 0;

            const avgRating =
                businesses.reduce(
                    (sum: number, b: any) => sum + (b.rating || 0),
                    0
                ) / businesses.length;

            console.log(
                `🏘️ ${name}: ${validCount}/${
                    businesses.length
                } valid coords → [${avgLat.toFixed(4)}, ${avgLng.toFixed(4)}]`
            );

            return {
                name,
                competitors: businesses.length,
                rating: parseFloat(avgRating.toFixed(1)),
                lat: avgLat,
                lng: avgLng,
            };
        })
        .filter((hotspot) => hotspot.competitors >= 2)
        .sort((a, b) => b.competitors - a.competitors)
        .slice(0, 3);
}

function calculateSummaryMetrics(businesses: any[]): SummaryMetrics {
    if (businesses.length === 0) {
        return {
            competitors: 0,
            hotspots: 0,
            avgRating: 0,
            competitorHotspots: [],
        };
    }

    const hotspots = calculateHotspots(businesses);
    const ratings = businesses.map((b) => b.rating || 0).filter((r) => r > 0);

    return {
        competitors: businesses.length,
        hotspots: hotspots.length,
        avgRating:
            ratings.length > 0
                ? parseFloat(
                      (
                          ratings.reduce((a, b) => a + b, 0) / ratings.length
                      ).toFixed(1)
                  ) // ✅ Round here too
                : 0,
        competitorHotspots: hotspots,
    };
}

export async function analyzeBusinessOpportunity(
    input: AnalysisInput
): Promise<AnalysisResult> {
    const { business, location } = input;

    try {
        const competitors = await searchCompetitors(business, location);
        const metrics = calculateSummaryMetrics(competitors);

        let topAreas: TopArea[] = [];
        try {
            topAreas = await searchTopAreasAI(business, location);
            console.log(`🤖 Got ${topAreas.length} parsed areas`);
        } catch (aiError) {
            console.warn("AI analysis failed, using fallback:", aiError);
        }

        console.log(
            `📊 Analysis complete: ${competitors.length} competitors, ${topAreas.length} areas`
        );
        return { metrics, topAreas, competitors };
    } catch (error) {
        console.error("❌ Analysis failed:", error);
        throw error;
    }
}

import { useState, useCallback } from "react";

export function useBusinessAnalysis() {
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyze = useCallback(async (input: AnalysisInput) => {
        setLoading(true);
        setError(null);

        try {
            console.log(
                `🔍 Starting analysis for "${input.business}" in "${input.location}"`
            );
            const analysis = await analyzeBusinessOpportunity(input);
            console.log(
                `✅ Analysis complete: ${analysis.competitors.length} competitors, ${analysis.topAreas.length} areas`
            );
            setResult(analysis);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Analysis failed";
            console.error("❌ Analysis failed:", message);
            setError(message);
            setResult(null);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        result,
        analyze,
        loading,
        error,
        metrics: result?.metrics,
        topAreas: result?.topAreas || [],
        competitors: result?.competitors || [],
    };
}

// src/lib/analysis/index.ts - ADD/REPLACE at bottom
export async function getTopAreaData(input: {
    business: string;
    location: string;
    area: string;
}): Promise<DetailedAreaData> {
    const response = await fetch("/api/area-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error(`Area analysis failed: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
}
