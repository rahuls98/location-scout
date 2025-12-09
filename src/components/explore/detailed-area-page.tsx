// src/components/explore/detailed-area-page.tsx - ✅ KEEP LAYOUT + DARKER BACKGROUNDS + FIXED KEYS
"use client";

import { Users, MapPin, Clock, Target, TrendingUp } from "lucide-react";
import { DetailedAreaData } from "@/lib/analysis/types";
import { Header } from "@/components/layout/header";

interface DetailedAreaPageProps {
    data: DetailedAreaData;
    business: string;
    location: string;
}

export function DetailedAreaPage({
    data,
    business,
    location,
}: DetailedAreaPageProps) {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Global Header */}
            <Header />

            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Clean Heading */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h1 className="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">
                            {String(data.name || "Neighborhood")} . {business}{" "}
                            Analysis
                        </h1>
                    </div>

                    {/* DEMOGRAPHICS - Section 1 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Users className="h-6 w-6 text-primary flex-shrink-0" />
                            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                                Demographics
                            </h2>
                        </div>
                        <div className="ml-9 p-5 rounded-lg border-2 border-gray-200/70 dark:border-gray-700/70 space-y-3">
                            {data.demographics.map((demo, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                                    <div>
                                        <div className="font-semibold text-primary text-sm uppercase tracking-wide mb-1">
                                            {String(demo.type || "N/A")}
                                        </div>
                                        <div className="text-text-secondary-light dark:text-text-secondary-dark text-base leading-relaxed">
                                            {String(demo.value || "N/A")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TRAFFIC - Section 2 (KEEP AS-IS - YOU LIKE IT) */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                            <h2 className="text-xl font-bold text-text-primary-light">
                                Foot Traffic
                            </h2>
                        </div>
                        <div className="ml-9 space-y-3 p-4 rounded-lg border-2 border-gray-200/70 dark:border-gray-700/70">
                            <div className="grid grid-cols-2 gap-4 text-text-secondary-light dark:text-text-secondary-dark">
                                <div>
                                    <div className="text-sm font-semibold uppercase tracking-wide text-text-primary-light dark:text-text-primary-dark mb-1">
                                        Weekday
                                    </div>
                                    <div>
                                        {String(
                                            data.traffic.weekday || "No data"
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold uppercase tracking-wide text-text-primary-light dark:text-primary-dark mb-1">
                                        Weekend
                                    </div>
                                    <div>
                                        {String(
                                            data.traffic.weekend || "No data"
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-300/70 dark:border-gray-600/70">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                                        Peak Hours
                                    </span>
                                </div>
                                <div className="mt-1 font-semibold text-lg text-text-primary-light dark:text-text-primary-dark">
                                    {String(
                                        data.traffic.peak_hours || "No data"
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COMPETITORS - Section 3 (KEEP AS-IS - YOU LIKE IT) */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Users className="h-6 w-6 text-primary flex-shrink-0" />
                            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                                Top Competitors
                            </h2>
                        </div>
                        <div className="ml-9 space-y-2">
                            {data.competitors.slice(0, 3).map((comp, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200/70 dark:border-gray-700/70"
                                >
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-primary font-bold text-sm">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-text-primary-light dark:text-text-primary-dark text-base">
                                            {String(comp.name || "Unnamed")}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                            <span>
                                                {Number(
                                                    comp.reviews || 0
                                                ).toLocaleString()}{" "}
                                                reviews
                                            </span>
                                            <span className="text-warning font-semibold">
                                                {Number(
                                                    comp.rating || 0
                                                ).toFixed(1)}
                                                ★
                                            </span>
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                                {String(comp.price || "N/A")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MARKET GAPS - Section 4 (KEEP AS-IS - YOU LIKE IT) */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Target className="h-6 w-6 text-primary flex-shrink-0" />
                            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                                Market Gaps
                            </h2>
                        </div>
                        <div className="ml-9 space-y-3 bg-warning/10 p-5 rounded-xl border-2 border-warning/30">
                            <ol className="space-y-3 text-text-secondary-light dark:text-text-secondary-dark list-decimal list-inside">
                                {data.gaps.map((gap, i) => (
                                    <li
                                        key={i}
                                        className="text-base leading-relaxed"
                                    >
                                        <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                            {String(gap.title || "Opportunity")}
                                        </span>
                                        {gap.description && (
                                            <div className="mt-1 text-text-secondary-light dark:text-text-secondary-dark">
                                                {String(gap.description)}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* KEYS TO SUCCESS - Section 5 (FIXED: Smaller + List Style) */}
                    {data.success_factors?.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />
                                <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                                    Keys to Success
                                </h2>
                            </div>
                            <div className="ml-9 space-y-2 bg-success/10 p-4 rounded-lg border-2 border-success/30">
                                <ul className="space-y-2 text-text-secondary-light dark:text-text-secondary-dark list-disc list-inside text-base">
                                    {data.success_factors.map((factor, i) => (
                                        <li key={i} className="leading-relaxed">
                                            <span className="font-semibold text-text-primary-light dark:text-text-primary-dark inline">
                                                {String(factor)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
