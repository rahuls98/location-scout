// src/lib/domain/analysis.server.ts
import type { AnalysisInput, AnalysisResult, TopArea } from "./types";
import { searchCompetitors, fetchTopAreasFromYelpAI } from "@/lib/ai/yelp";
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
