// src/app/(analysis)/analysis/loading-screen.tsx
"use client";

import { Header } from "@/components/layout/header";

interface LoadingScreenProps {
    business: string;
    location: string;
}

export function LoadingScreen({ business, location }: LoadingScreenProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center">
            <Header />
            <div className="max-w-md space-y-6">
                <div className="space-y-2">
                    <br />
                    <h1 className="text-2xl font-bold tracking-tight text-muted-foreground">
                        Analyzing the {business} market in {location}
                    </h1>
                </div>
                <div className="mx-auto flex size-24 items-center justify-center">
                    <div className="size-20 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
                </div>
            </div>
        </div>
    );
}
