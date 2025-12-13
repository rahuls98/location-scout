// lib/ai/yelp.ts
import { getYelpV3Client, getYelpAIClient } from "@/lib/clients/yelp";
import {
    TOP_AREAS_YELP_PROMPT,
    DETAILED_ANALYSIS_YELP_PROMPT,
    CUSTOMER_REVIEW_INSIGHTS_YELP_PROMPT,
    OFFERING_INSIGHTS_YELP_PROMPT,
} from "./prompts";
import { parseTopAreasWithLLM, parseDetailedAreaWithLLM } from "./llm";
import type {
    TopArea,
    DetailedAreaData,
    YelpBusiness,
    CustomerReviewInsightsInput,
    CustomerReviewInsightsResponse,
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

export async function fetchCustomerReviewInsightsFromYelpAI(
    input: CustomerReviewInsightsInput
): Promise<CustomerReviewInsightsResponse> {
    const { query, business, location, area } = input;

    const client = await getYelpAIClient();
    const { data } = await client.post("/ai/chat/v2", {
        requestcontext: { skip_text_generation: false },
        query: CUSTOMER_REVIEW_INSIGHTS_YELP_PROMPT({
            query,
            business,
            area,
            location,
        }),
    });

    const reviewInsights = data?.response?.text?.trim();
    if (!reviewInsights) {
        throw new Error("Yelp AI returned no insights");
    }
    return {
        query,
        business,
        area,
        location,
        insights: reviewInsights,
    };
}

export async function fetchServiceOfferingInsightsFromYelpAI(
    business: string,
    area: string,
    location: string
): Promise<string> {
    const client = await getYelpAIClient();
    const { data } = await client.post("/ai/chat/v2", {
        requestcontext: { skiptextgeneration: false },
        query: OFFERING_INSIGHTS_YELP_PROMPT({ business, area, location }),
    });

    const insights = data?.response?.text?.trim();
    if (!insights) {
        throw new Error("Yelp AI returned no service insights");
    }

    return insights;
}
