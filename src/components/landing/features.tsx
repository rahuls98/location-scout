// components/landing/features.tsx
"use client";

import { Card } from "@/components/ui/card";
import { MapPin, BarChart3, Search } from "lucide-react";

export function Features() {
    return (
        <section className="flex flex-col gap-4">
            <Card className="flex flex-col gap-2 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-primary">
                    <MapPin className="h-4 w-4" />
                    <h3 className="text-sm font-semibold">
                        AI-Powered Neighborhood Scores
                    </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                    Yelp AI analyzes business data, reviews, and traffic
                    patterns to score neighborhoods where your concept has
                    maximum potential.
                </p>
            </Card>

            <Card className="flex flex-col gap-2 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-primary">
                    <BarChart3 className="h-4 w-4" />
                    <h3 className="text-sm font-semibold">
                        Market Gaps from Reviews
                    </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                    Yelp AI extracts specific customer complaints and missing
                    offerings from competitor reviews to reveal your
                    opportunity.
                </p>
            </Card>

            <Card className="flex flex-col gap-2 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-primary">
                    <Search className="h-4 w-4" />
                    <h3 className="text-sm font-semibold">
                        Competitor Intelligence
                    </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                    Instant snapshot of local competitors, ratings, pricing, and
                    saturation powered by Yelp's real-time business data.
                </p>
            </Card>
        </section>
    );
}
