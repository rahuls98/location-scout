export interface ViewportInfo {
    bbox: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
    center: {
        lat: number;
        lng: number;
    };
}

export function getViewportInfo(map: any): ViewportInfo {
    const bounds = map.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const center = bounds.getCenter();

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

// Reverse geocode to get a major area label
export async function getAreaTitleFromCenter(
    lat: number,
    lng: number
): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2&zoom=14&addressdetails=1`;

    const res = await fetch(url, {
        headers: {
            "User-Agent": "yelp-ai-area-explorer/1.0 (email@example.com)",
        },
    });

    if (!res.ok) {
        console.warn("Reverse geocode failed", res.status);
        return "This area";
    }

    const data = await res.json();
    const addr = data.address || {};

    // Prefer neighborhood / suburb / city_district, then city/town [web:45]
    return (
        addr.neighbourhood ||
        addr.suburb ||
        addr.city_district ||
        addr.borough ||
        addr.city ||
        addr.town ||
        addr.village ||
        data.display_name ||
        "This area"
    );
}
