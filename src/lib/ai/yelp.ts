// lib/ai/yelp.ts
import { getYelpV3Client, getYelpAIClient } from "@/lib/clients/yelp";
import {
    TOP_AREAS_YELP_PROMPT,
    DETAILED_ANALYSIS_YELP_PROMPT,
} from "./prompts";
import { parseTopAreasWithLLM, parseDetailedAreaWithLLM } from "./llm";
import type {
    TopArea,
    DetailedAreaData,
    YelpBusiness,
} from "@/lib/domain/types";

export async function searchCompetitors(
    business: string,
    location: string
): Promise<YelpBusiness[]> {
    const client = await getYelpV3Client();

    const { data } = await client.get("/businesses/search", {
        params: {
            term: business,
            location,
            limit: 50,
            sort_by: "best_match",
        },
    });

    return data.businesses || [];
}

export async function fetchTopAreasFromYelpAI(input: {
    business: string;
    location: string;
}): Promise<{ topAreas: TopArea[]; yelpText: string }> {
    const { business, location } = input;
    const client = await getYelpAIClient();

    const { data } = await client.post("/ai/chat/v2", {
        request_context: { skip_text_generation: false },
        query: TOP_AREAS_YELP_PROMPT(business, location),
    });

    const yelpText: string = data?.response?.text || "";
    const topAreas = await parseTopAreasWithLLM(yelpText);
    return { topAreas, yelpText };
}

export async function fetchDetailedAreaFromYelpAI(input: {
    business: string;
    location: string;
    area: string;
}): Promise<{ data: DetailedAreaData; yelpText: string }> {
    const { business, location, area } = input;
    const client = await getYelpAIClient();

    const { data } = await client.post("/ai/chat/v2", {
        request_context: { skip_text_generation: false },
        query: DETAILED_ANALYSIS_YELP_PROMPT({ business, location, area }),
    });

    const yelpText: string = data?.response?.text || "";
    const parsed = await parseDetailedAreaWithLLM(yelpText, area);
    return { data: parsed, yelpText };
}
