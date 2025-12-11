// src/lib/maps/utils.ts - Leaflet map + geolocation utilities
import { LatLngBounds, LatLng } from "leaflet";

export interface ViewportInfo {
    bbox: { north: number; south: number; east: number; west: number };
    center: { lat: number; lng: number };
}

/**
 * Extract viewport bounds + center from Leaflet map instance
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
 * Reverse geocode coordinates → human-readable area name
 * Format: "Neighborhood, City, State" or "City, State"
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

        // Priority: neighborhood/suburb → city_district/borough → city/town
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

        // Always include City + State
        if (city && state) {
            return area && area !== city
                ? `${area}, ${city}, ${state}`
                : `${city}, ${state}`;
        }

        // Fallback to unknown
        return "";
    } catch (error) {
        console.warn("Geocoding error:", error);
        return "This area";
    }
}
