// src/lib/domain/analysis.server.ts

import type {
    AnalysisInput,
    AnalysisResult,
    CustomerReviewInsightsInput,
    CustomerReviewInsightsResponse,
    TopArea,
} from "./types";

import {
    fetchCompetitorsFromYelp,
    fetchTopAreasFromYelpAI,
    fetchCustomerReviewInsightsFromYelpAI,
    fetchServiceOfferingInsightsFromYelpAI,
} from "@/lib/ai/yelp";

import { calculateSummaryMetrics } from "./analysis.utils";

/**
 * Core server-side pipeline for a business/location analysis.
 */
export async function analyzeBusinessOpportunityServer(
    input: AnalysisInput
): Promise<AnalysisResult> {
    const { business, location } = input;

    const competitors = await fetchCompetitorsFromYelp(business, location);
    const metrics = calculateSummaryMetrics(competitors);

    let topAreas: TopArea[] = [];

    try {
        const response = await fetchTopAreasFromYelpAI({ business, location });
        topAreas = response.topAreas;
    } catch (error) {
        console.warn("AI top areas failed:", error);
    }

    return { metrics, topAreas, competitors };
}

/**
 * Gets structured insights from customer reviews via Yelp AI.
 */
export async function getCustomerReviewInsights(
    input: CustomerReviewInsightsInput
): Promise<CustomerReviewInsightsResponse> {
    return fetchCustomerReviewInsightsFromYelpAI(input);
}

/**
 * Gets a narrative of service offering opportunities for a given area.
 */
export async function getServiceOfferingInsights(
    business: string,
    area: string,
    location: string
): Promise<string> {
    return fetchServiceOfferingInsightsFromYelpAI(business, area, location);
}
