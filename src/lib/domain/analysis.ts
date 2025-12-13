// src/lib/domain/analysis.ts
"use client";

import { useCallback, useState } from "react";
import type {
    AnalysisInput,
    AnalysisResult,
    DetailedAreaData,
    CustomerReviewInsightsInput,
    CustomerReviewInsightsResponse,
} from "./types";

const ANALYSIS_CACHE_KEY = "analysis-cache";

function getCache(): Record<string, AnalysisResult> {
    if (typeof window === "undefined") return {};
    try {
        const raw = sessionStorage.getItem(ANALYSIS_CACHE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function setCacheEntry(id: string, result: AnalysisResult) {
    if (typeof window === "undefined") return;
    const cache = getCache();
    cache[id] = result;
    sessionStorage.setItem(ANALYSIS_CACHE_KEY, JSON.stringify(cache));
}

function getCacheEntry(id: string): AnalysisResult | null {
    const cache = getCache();
    return cache[id] || null;
}

export function useAnalysis(id?: string) {
    const [result, setResult] = useState<AnalysisResult | null>(() => {
        if (!id) return null;
        return getCacheEntry(id);
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyze = useCallback(
        async (input: AnalysisInput) => {
            setLoading(true);
            setError(null);
            try {
                const analysis = await getAnalysisData(input);
                setResult(analysis);
                if (id) {
                    setCacheEntry(id, analysis);
                }
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "Analysis failed";
                console.error("❌ Analysis failed:", message);
                setError(message);
                setResult(null);
            } finally {
                setLoading(false);
            }
        },
        [id]
    );

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

export async function getAnalysisData(
    input: AnalysisInput
): Promise<AnalysisResult> {
    const response = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
    }

    const { data } = await response.json();
    return data as AnalysisResult;
}

interface DetailedInput {
    business: string;
    location: string;
    area: string;
}

interface DetailedState {
    loading: boolean;
    error: string | null;
    data: DetailedAreaData | null;
}

export function useDetailedAnalysis() {
    const [state, setState] = useState<DetailedState>({
        loading: false,
        error: null,
        data: null,
    });

    const loadDetailedArea = useCallback(async (input: DetailedInput) => {
        setState({ loading: true, error: null, data: null });
        try {
            const data = await getDetailedAnalysisData(input);
            setState({ loading: false, error: null, data });
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Detailed analysis failed";
            console.error("❌ Detailed analysis failed:", message);
            setState({ loading: false, error: message, data: null });
        }
    }, []);

    return {
        loading: state.loading,
        error: state.error,
        data: state.data,
        loadDetailedArea,
    };
}

export async function getDetailedAnalysisData(
    input: DetailedInput
): Promise<DetailedAreaData> {
    const response = await fetch("/api/detailed-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error(`Detailed analysis failed: ${response.status}`);
    }

    const { data } = await response.json();
    return data as DetailedAreaData;
}

export function useCustomerReviewsInsight() {
    const [insights, setInsights] =
        useState<CustomerReviewInsightsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getInsights = useCallback(
        async (input: CustomerReviewInsightsInput) => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/customer-review-insights", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(input),
                });

                if (!response.ok) {
                    throw new Error(
                        `Reviews insight failed: ${response.status}`
                    );
                }

                const result = await response.json();
                if (result.success) {
                    setInsights(result.data);
                } else {
                    throw new Error(result.error || "Unknown error");
                }
            } catch (err: any) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Reviews insight failed";
                console.error("Customer reviews insight failed:", message);
                setError(message);
                setInsights(null);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        insights,
        getInsights,
        loading,
        error,
    };
}

export function useServiceOfferingInsights() {
    const [insights, setInsights] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getInsights = useCallback(
        async (business: string, area: string, location: string) => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/service-offering-insights", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ business, area, location }),
                });

                if (!response.ok) {
                    throw new Error(
                        `Service insights failed: ${response.status}`
                    );
                }

                const result = await response.json();
                if (result.success) {
                    setInsights(result.data);
                } else {
                    throw new Error(result.error || "Unknown error");
                }
            } catch (err: any) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Service insights failed";
                console.error("Service offering insights failed:", message);
                setError(message);
                setInsights("");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        insights,
        getInsights,
        loading,
        error,
    };
}
