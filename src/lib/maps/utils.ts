// src/lib/maps/utils.ts

import { LatLngBounds, LatLng } from "leaflet";

export interface ViewportInfo {
    bbox: { north: number; south: number; east: number; west: number };
    center: { lat: number; lng: number };
}

/**
 * Extracts viewport bounds and center from a Leaflet map instance.
 */
export function getViewportInfo(map: any): ViewportInfo {
    const bounds = map.getBounds() as LatLngBounds;
    const ne = bounds.getNorthEast() as LatLng;
    const sw = bounds.getSouthWest() as LatLng;
    const center = bounds.getCenter() as LatLng;

    return {
        bbox: {
            north: ne.lat,
            south: sw.lat,
            east: ne.lng,
            west: sw.lng,
        },
        center: {
            lat: center.lat,
            lng: center.lng,
        },
    };
}

/**
 * Reverse geocodes coordinates into a human-readable area label.
 * Preferred formats:
 * - "Neighborhood, City, State"
 * - "City, State"
 */
export async function getAreaTitleFromCenter(
    lat: number,
    lng: number
): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2&zoom=14&addressdetails=1`;

    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "LocationScout/1.0",
            },
        });

        if (!res.ok) {
            console.warn("Reverse geocode failed:", res.status);
            return "This area";
        }

        const data = await res.json();
        const addr = data.address || {};

        const area =
            addr.neighbourhood ||
            addr.suburb ||
            addr.city_district ||
            addr.borough ||
            addr.city ||
            addr.town ||
            addr.village;

        const city = addr.city || addr.town || addr.village || addr.county;
        const state = addr.state || addr.state_district;

        if (city && state) {
            return area && area !== city
                ? `${area}, ${city}, ${state}`
                : `${city}, ${state}`;
        }

        return "This area";
    } catch (error) {
        console.warn("Geocoding error:", error);
        return "This area";
    }
}
