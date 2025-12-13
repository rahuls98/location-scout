// src/components/detailed-analysis/competitor-review-insights-panel.tsx
"use client";

import { useState } from "react";
import { useCustomerReviewsInsight } from "@/lib/domain/analysis";

export default function CompetitorReviewInsights({
    business,
    area,
    location,
}: {
    business: string;
    area: string;
    location: string;
}) {
    const { insights, getInsights, loading, error } =
        useCustomerReviewsInsight();
    const [query, setQuery] = useState("");

    const handleAnalyze = () => {
        if (query.trim()) {
            getInsights({ query: query.trim(), business, area, location });
        }
    };

    return (
        <>
            <div className="mb-2 flex flex-col gap-2">
                <input
                    className="h-9 w-full cursor-text rounded-md border border-input bg-background px-2 text-xs md:text-sm placeholder:text-muted-foreground"
                    type="text"
                    placeholder="Ask about competitor reviews"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAnalyze();
                        }
                    }}
                    disabled={loading}
                />
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border bg-primary px-4 py-2 text-xs text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                    disabled={loading || !query.trim()}
                    onClick={handleAnalyze}
                >
                    Analyze reviews
                </button>
            </div>

            <div
                className={
                    "flex-1 rounded-md p-3 text-xs md:text-sm leading-snug min-h-[120px] text-foreground bg-muted/50"
                }
            >
                {loading && (
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                        <span>Analyzing...</span>
                    </div>
                )}
                {error && <p className="text-destructive">{error}</p>}
                {insights && !loading && (
                    <div className="max-h-none overflow-y-auto prose prose-sm max-w-none">
                        {insights.insights}
                    </div>
                )}
                {!insights && !loading && !error && (
                    <p className="mt-0.5 text-[11px] md:text-xs text-muted-foreground leading-snug">
                        A short summary of what customers praise and complain
                        about in nearby competitor reviews will appear here. Use
                        this to understand service gaps, expectations, and
                        recurring themes around quality, speed, and space.
                    </p>
                )}
            </div>
        </>
    );
}
