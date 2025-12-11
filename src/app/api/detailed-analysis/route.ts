// src/app/api/detailed-analysis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchDetailedAreaFromYelpAI } from "@/lib/ai/yelp";

export async function POST(request: NextRequest) {
    try {
        const { business, location, area } = (await request.json()) as {
            business: string;
            location: string;
            area: string;
        };

        if (!business || !location || !area) {
            return NextResponse.json(
                {
                    success: false,
                    error: "business, location, and area are required",
                },
                { status: 400 }
            );
        }

        const { data } = await fetchDetailedAreaFromYelpAI({
            business,
            location,
            area,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Detailed analysis failed";
        console.error("❌ /api/detailed-analysis error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
