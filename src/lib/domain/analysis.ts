// src/lib/domain/analysis.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type {
    AnalysisInput,
    AnalysisResult,
    DetailedAreaData,
    CustomerReviewInsightsInput,
    CustomerReviewInsightsResponse,
} from "./types";

const ANALYSIS_CACHE_KEY = "analysis-cache";
const DETAILED_CACHE_KEY = "detailed-analysis-cache";

type AnalysisCache = Record<string, AnalysisResult>;
type DetailedCache = Record<string, DetailedAreaData>;

/**
 * Shared error message for generic failures.
 */
const FALLBACK_ERROR = "Something went wrong. Please try again.";

/**
 * Lazy in-memory snapshot of the session cache to avoid repeated JSON.parse.
 */
let memoryAnalysisCache: AnalysisCache | null = null;
let memoryDetailedCache: DetailedCache | null = null;

function ensureAnalysisCache(): AnalysisCache {
    if (memoryAnalysisCache) return memoryAnalysisCache;
    if (typeof window === "undefined") {
        memoryAnalysisCache = {};
        return memoryAnalysisCache;
    }

    try {
        const raw = window.sessionStorage.getItem(ANALYSIS_CACHE_KEY);
        memoryAnalysisCache = raw ? (JSON.parse(raw) as AnalysisCache) : {};
    } catch {
        memoryAnalysisCache = {};
    }

    return memoryAnalysisCache!;
}

function ensureDetailedCache(): DetailedCache {
    if (memoryDetailedCache) return memoryDetailedCache;
    if (typeof window === "undefined") {
        memoryDetailedCache = {};
        return memoryDetailedCache;
    }

    try {
        const raw = window.sessionStorage.getItem(DETAILED_CACHE_KEY);
        memoryDetailedCache = raw ? (JSON.parse(raw) as DetailedCache) : {};
    } catch {
        memoryDetailedCache = {};
    }

    return memoryDetailedCache!;
}

function persistAnalysisCache() {
    if (typeof window === "undefined" || !memoryAnalysisCache) return;
    try {
        window.sessionStorage.setItem(
            ANALYSIS_CACHE_KEY,
            JSON.stringify(memoryAnalysisCache)
        );
    } catch {
        // ignore storage errors
    }
}

function persistDetailedCache() {
    if (typeof window === "undefined" || !memoryDetailedCache) return;
    try {
        window.sessionStorage.setItem(
            DETAILED_CACHE_KEY,
            JSON.stringify(memoryDetailedCache)
        );
    } catch {
        // ignore storage errors
    }
}

/**
 * Writes a single analysis entry into the in-memory and session cache.
 */
function writeAnalysisCacheEntry(id: string, result: AnalysisResult) {
    const cache = ensureAnalysisCache();
    cache[id] = result;
    persistAnalysisCache();
}

/**
 * Writes a single detailed analysis entry into the in-memory and session cache.
 */
function writeDetailedCacheEntry(id: string, result: DetailedAreaData) {
    const cache = ensureDetailedCache();
    cache[id] = result;
    persistDetailedCache();
}

/**
 * Reads a single analysis entry by id from the in-memory cache.
 */
function readAnalysisCacheEntry(id: string): AnalysisResult | null {
    const cache = ensureAnalysisCache();
    return cache[id] || null;
}

/**
 * Reads a single detailed analysis entry by id from the in-memory cache.
 */
function readDetailedCacheEntry(id: string): DetailedAreaData | null {
    const cache = ensureDetailedCache();
    return cache[id] || null;
}

/**
 * Hook for the main analysis view.
 */
export function useAnalysis(id?: string) {
    const [result, setResult] = useState<AnalysisResult | null>(() => {
        if (!id) return null;
        return readAnalysisCacheEntry(id);
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Keep local state in sync when the analysis id changes.
    useEffect(() => {
        if (!id) {
            setResult(null);
            setLoading(false);
            setError(null);
            return;
        }

        const cached = readAnalysisCacheEntry(id);
        if (cached) {
            setResult(cached);
            setLoading(false);
            setError(null);
        } else {
            setResult(null);
        }
    }, [id]);

    const analyze = useCallback(
        async (input: AnalysisInput) => {
            if (!id) return;

            const existing = readAnalysisCacheEntry(id);
            if (existing) {
                setResult(existing);
                setLoading(false);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const analysis = await getAnalysisData(input);
                setResult(analysis);
                writeAnalysisCacheEntry(id, analysis);
            } catch (err) {
                const message =
                    err instanceof Error && err.message
                        ? err.message
                        : "Analysis failed to load.";
                console.error("Analysis failed:", message);
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
        topAreas: result?.topAreas ?? [],
        competitors: result?.competitors ?? [],
    };
}

/**
 * Calls the main analysis API for a business and location.
 */
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

/**
 * Hook for a single area's deeper dive panel.
 */
export function useDetailedAnalysis(id?: string) {
    const [state, setState] = useState<DetailedState>({
        loading: false,
        error: null,
        data: null,
    });

    // Client-only cache sync (post-hydration, no SSR issues)
    useEffect(() => {
        if (!id || typeof window === "undefined") {
            setState({ loading: false, error: null, data: null });
            return;
        }

        const cached = readDetailedCacheEntry(id);
        setState({ loading: false, error: null, data: cached || null });
    }, [id]);

    const loadDetailedArea = useCallback(
        async (input: DetailedInput) => {
            // Generate consistent cacheId using current id/input (no stale closure)
            const cacheId =
                id || `${input.business}|${input.location}|${input.area}`;

            // Check cache first
            const cached = readDetailedCacheEntry(cacheId);
            if (cached) {
                setState({ loading: false, error: null, data: cached });
                return;
            }

            setState({ loading: true, error: null, data: null });

            try {
                const data = await getDetailedAnalysisData(input);
                setState({ loading: false, error: null, data });
                writeDetailedCacheEntry(cacheId, data);
            } catch (err) {
                const message =
                    err instanceof Error && err.message
                        ? err.message
                        : FALLBACK_ERROR;
                console.error("Detailed analysis failed:", message);
                setState({ loading: false, error: message, data: null });
            }
        },
        [id]
    );

    return {
        loading: state.loading,
        error: state.error,
        data: state.data,
        loadDetailedArea,
    };
}

/**
 * Calls the API for a detailed area breakdown.
 */
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

/**
 * Hook for summarizing customer reviews with Yelp AI.
 */
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
                    setInsights(result.data as CustomerReviewInsightsResponse);
                } else {
                    throw new Error(result.error || FALLBACK_ERROR);
                }
            } catch (err: any) {
                const message =
                    err instanceof Error && err.message
                        ? err.message
                        : "Reviews insight failed to load.";
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

/**
 * Hook for generating service offering recommendations per area.
 */
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
                    setInsights(result.data as string);
                } else {
                    throw new Error(result.error || FALLBACK_ERROR);
                }
            } catch (err: any) {
                const message =
                    err instanceof Error && err.message
                        ? err.message
                        : "Service insights failed to load.";
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
