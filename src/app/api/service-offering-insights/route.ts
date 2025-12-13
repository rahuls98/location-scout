// app/api/service-offerings-insight/route.ts - NEW ROUTE
import { NextRequest, NextResponse } from "next/server";
import { getServiceOfferingInsights } from "@/lib/domain/analysis.server";

export async function POST(request: NextRequest) {
    try {
        const { business, area, location } = await request.json();

        if (!business || !area || !location) {
            return NextResponse.json(
                {
                    success: false,
                    error: "business, area, and location are required",
                },
                { status: 400 }
            );
        }

        const data = await getServiceOfferingInsights(business, area, location);

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error: any) {
        const message =
            error instanceof Error
                ? error.message
                : "Service offering insights failed";
        console.error("api/service-offering-insights error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
