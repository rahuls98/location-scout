import { getYelpV3Client, getYelpAIClient } from "@/lib/clients/yelp";
import { TOP_AREAS_PROMPT } from "./prompts";
import { TopArea } from "./types";

// Client-side wrapper - calls API route for server-side Yelp access
export interface YelpBusiness {
    id: string;
    name: string;
    rating: number;
    review_count: number;
    location: {
        neighborhood?: string[];
        city: string;
        address1?: string;
        address2?: string;
        country: string;
        state: string;
        zip_code: string;
    };
    coordinates: {
        latitude: number;
        longitude: number;
    };
    categories: Array<{
        alias: string;
        title: string;
    }>;
}

export async function searchCompetitors(
    business: string,
    location: string
): Promise<YelpBusiness[]> {
    const client = await getYelpV3Client(); // ✅ V3 for search

    const params = {
        term: business,
        location,
        limit: 50,
        sort_by: "best_match",
    };

    const { data } = await client.get("/businesses/search", { params });
    console.log(`Yelp returned ${data.businesses?.length || 0} competitors`);

    return data.businesses || [];
}

// src/lib/analysis/yelp.ts
export async function searchTopAreasAI(
    business: string,
    location: string
): Promise<TopArea[]> {
    // ✅ Changed return type
    const response = await fetch("/api/yelp/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, location }),
    });

    if (!response.ok) {
        console.warn("Yelp AI failed:", response.status);
        return []; // ✅ Empty array fallback
    }

    const { topAreas } = await response.json(); // ✅ Direct TopArea[]
    return topAreas;
}
