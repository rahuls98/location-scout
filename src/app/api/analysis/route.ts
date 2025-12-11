// src/app/api/analysis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { analyzeBusinessOpportunityServer } from "@/lib/domain/analysis.server";
import type { AnalysisInput } from "@/lib/domain/types";

export async function POST(request: NextRequest) {
    try {
        const { business, location } = (await request.json()) as AnalysisInput;

        if (!business || !location) {
            return NextResponse.json(
                { success: false, error: "business and location are required" },
                { status: 400 }
            );
        }

        const data = await analyzeBusinessOpportunityServer({
            business,
            location,
        });
        return NextResponse.json({ success: true, data });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Analysis failed";
        console.error("❌ /api/analysis error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
