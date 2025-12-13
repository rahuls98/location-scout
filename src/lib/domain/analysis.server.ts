// src/lib/domain/analysis.server.ts
import type {
    AnalysisInput,
    AnalysisResult,
    CustomerReviewInsightsInput,
    CustomerReviewInsightsResponse,
    TopArea,
} from "./types";
import {
    searchCompetitors,
    fetchTopAreasFromYelpAI,
    fetchCustomerReviewInsightsFromYelpAI,
    fetchServiceOfferingInsightsFromYelpAI,
} from "@/lib/ai/yelp";
import { calculateSummaryMetrics } from "./analysis.utils";

export async function analyzeBusinessOpportunityServer(
    input: AnalysisInput
): Promise<AnalysisResult> {
    const { business, location } = input;
    const competitors = await searchCompetitors(business, location);
    const metrics = calculateSummaryMetrics(competitors);

    let topAreas: TopArea[] = [];
    try {
        const { topAreas: areas } = await fetchTopAreasFromYelpAI({
            business,
            location,
        });
        topAreas = areas;
    } catch (error) {
        console.warn("AI top areas failed:", error);
    }

    return { metrics, topAreas, competitors };
}

export async function getCustomerReviewInsights(
    input: CustomerReviewInsightsInput
): Promise<CustomerReviewInsightsResponse> {
    return await fetchCustomerReviewInsightsFromYelpAI(input);
}

export async function getServiceOfferingInsights(
    business: string,
    area: string,
    location: string
): Promise<string> {
    return await fetchServiceOfferingInsightsFromYelpAI(
        business,
        area,
        location
    );
}
