// src/app/(analysis)/analysis/no-results.tsx
"use client";

import { Header } from "@/components/layout/header";

export function NoResults() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center">
            <Header />
            <div className="max-w-md space-y-6">
                <div className="space-y-4">
                    <br />
                    <h1 className="text-3xl font-bold md:text-4xl text-primary">
                        No market data available for this analysis.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        Try adjusting your business type or location parameters.
                    </p>
                </div>
                <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-lg border bg-primary px-6 py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                    ← Back to Home
                </a>
            </div>
        </div>
    );
}
