// src/lib/domain/analysis.utils.ts

import type { SummaryMetrics, YelpBusiness } from "./types";

interface Hotspot {
    name: string;
    competitors: number;
    rating: number;
    lat: number;
    lng: number;
}

/**
 * Groups competitors into neighborhood-level hotspots with centroid coordinates.
 */
export function calculateHotspots(businesses: YelpBusiness[]): Hotspot[] {
    if (!businesses.length) {
        return [];
    }

    const neighborhoods: Record<string, YelpBusiness[]> = {};

    for (const business of businesses) {
        const neighborhood =
            business.location.neighborhood?.[0] ||
            business.location.city ||
            "City Center";

        const bucket = neighborhoods[neighborhood];
        if (bucket) {
            bucket.push(business);
        } else {
            neighborhoods[neighborhood] = [business];
        }
    }

    const hotspots: Hotspot[] = [];

    for (const [name, neighborhoodBusinesses] of Object.entries(
        neighborhoods
    )) {
        let latSum = 0;
        let lngSum = 0;
        let coordCount = 0;
        let ratingSum = 0;

        for (const b of neighborhoodBusinesses) {
            const coords = b.coordinates;
            if (
                coords &&
                typeof coords.latitude === "number" &&
                typeof coords.longitude === "number" &&
                !Number.isNaN(coords.latitude) &&
                !Number.isNaN(coords.longitude)
            ) {
                latSum += coords.latitude;
                lngSum += coords.longitude;
                coordCount += 1;
            }

            ratingSum += b.rating || 0;
        }

        const competitors = neighborhoodBusinesses.length;
        if (competitors < 2) continue;

        const avgLat = coordCount ? latSum / coordCount : 0;
        const avgLng = coordCount ? lngSum / coordCount : 0;
        const avgRatingRaw = ratingSum / competitors;

        hotspots.push({
            name,
            competitors,
            rating: parseFloat(avgRatingRaw.toFixed(1)),
            lat: avgLat,
            lng: avgLng,
        });
    }

    hotspots.sort((a, b) => b.competitors - a.competitors);

    return hotspots.slice(0, 3);
}

/**
 * Builds overall summary metrics for a competitor set.
 */
export function calculateSummaryMetrics(
    businesses: YelpBusiness[]
): SummaryMetrics {
    const total = businesses.length;

    if (!total) {
        return {
            competitors: 0,
            hotspots: 0,
            avgRating: 0,
            competitorHotspots: [],
        };
    }

    const hotspots = calculateHotspots(businesses);

    let ratingSum = 0;
    let ratingCount = 0;

    for (const b of businesses) {
        const r = b.rating || 0;
        if (r > 0) {
            ratingSum += r;
            ratingCount += 1;
        }
    }

    const avgRating =
        ratingCount > 0 ? parseFloat((ratingSum / ratingCount).toFixed(1)) : 0;

    return {
        competitors: total,
        hotspots: hotspots.length,
        avgRating,
        competitorHotspots: hotspots,
    };
}
