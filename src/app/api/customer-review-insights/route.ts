// app/api/customer-review-insights/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCustomerReviewInsights } from "@/lib/domain/analysis.server";

export async function POST(request: NextRequest) {
    try {
        const { query, business, location, area } = await request.json();

        if (!query || !business || !location || !area) {
            return NextResponse.json(
                {
                    success: false,
                    error: "query, business, location, and area are required",
                },
                { status: 400 }
            );
        }

        const data = await getCustomerReviewInsights({
            query,
            business,
            location,
            area,
        });

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error: any) {
        const message =
            error instanceof Error
                ? error.message
                : "Customer reviews insight failed";
        console.error("api/customer-reviews-insight error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
