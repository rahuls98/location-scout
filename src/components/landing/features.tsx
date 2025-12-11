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
                        Neighborhood scoring
                    </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                    See which neighborhoods have the right mix of demand,
                    competition, and foot traffic for your concept.
                </p>
            </Card>

            <Card className="flex flex-col gap-2 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-primary">
                    <BarChart3 className="h-4 w-4" />
                    <h3 className="text-sm font-semibold">Market gaps</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                    Pull gaps straight from Yelp reviews to spot what existing
                    businesses are not delivering yet.
                </p>
            </Card>

            <Card className="flex flex-col gap-2 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-primary">
                    <Search className="h-4 w-4" />
                    <h3 className="text-sm font-semibold">
                        Competitor snapshot
                    </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                    Get a quick view of top competitors, ratings, and price
                    levels so you can position your offering clearly.
                </p>
            </Card>
        </section>
    );
}
