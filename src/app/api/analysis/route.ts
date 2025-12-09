import { NextRequest, NextResponse } from "next/server";
import { analyzeBusinessOpportunity } from "@/lib/analysis";

export async function POST(request: NextRequest) {
    try {
        const { business, location } = await request.json();

        const result = await analyzeBusinessOpportunity({ business, location });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error ? error.message : "Analysis failed",
            },
            { status: 500 }
        );
    }
}
