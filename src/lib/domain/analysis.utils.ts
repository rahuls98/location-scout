// src/lib/domain/analysis.utils.ts
import type { SummaryMetrics, YelpBusiness } from "./types";

export function calculateHotspots(businesses: YelpBusiness[]): Array<{
    name: string;
    competitors: number;
    rating: number;
    lat: number;
    lng: number;
}> {
    const neighborhoods = businesses.reduce<Record<string, YelpBusiness[]>>(
        (acc, business) => {
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
            const validCoords = businesses
                .map((b) => b.coordinates)
                .filter(
                    (c) =>
                        c?.latitude &&
                        c?.longitude &&
                        !Number.isNaN(c.latitude) &&
                        !Number.isNaN(c.longitude)
                );

            const validCount = validCoords.length;
            const avgLat =
                validCount > 0
                    ? validCoords.reduce((sum, c) => sum + c.latitude, 0) /
                      validCount
                    : 0;
            const avgLng =
                validCount > 0
                    ? validCoords.reduce((sum, c) => sum + c.longitude, 0) /
                      validCount
                    : 0;
            const avgRating =
                businesses.reduce((sum, b) => sum + (b.rating || 0), 0) /
                businesses.length;

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

export function calculateSummaryMetrics(
    businesses: YelpBusiness[]
): SummaryMetrics {
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
                  )
                : 0,
        competitorHotspots: hotspots,
    };
}
