// src/app/api/area-analysis/route.ts - ✅ FIXED NVIDIA JSON EXTRACTION (handles "Here is the EXACT JSON" prefix)
import { NextRequest, NextResponse } from "next/server";
import { getYelpAIClient } from "@/lib/clients/yelp";
import { getNvidiaClient } from "@/lib/clients/nvidia";
import { DetailedAreaData } from "@/lib/analysis/types";
import { PARSE_DETAILED_AREA_PROMPT } from "@/lib/analysis/prompts";

export async function POST(request: NextRequest) {
    // TOP-LEVEL vars - available in catch block
    let business = "Coffee Shop";
    let location = "Somerville";
    let area = "Unknown Area";

    try {
        const input = await request.json();
        business = input.business ?? business;
        location = input.location ?? location;
        area = input.area ?? area;

        console.log(`📍 Analyzing "${business}" in "${location}'s ${area}"`);

        // 1. Get Yelp AI response
        const aiClient = await getYelpAIClient();
        const { data } = await aiClient.post("/ai/chat/v2", {
            request_context: { skip_text_generation: false },
            query: `Detailed analysis for opening ${business} in ${location}'s ${area} neighborhood. Provide: 1. Competitor breakdown - Top 5 competitors, ratings, review counts, price levels 2. Customer demographics - Age, income, lifestyle, peak hours from reviews 3. Market gaps - 3-5 specific opportunities from negative competitor reviews 4. Foot traffic patterns - Weekday/weekend, peak times from check-ins 5. Scorecard - Saturation(30%), Demographics(25%), Gaps(25%), Traffic(20%) 6. Success factors - What makes winners succeed here. Format each section clearly with bullet points.`,
        });

        const yelpText = data.response?.text || "";
        console.log("🤖 Yelp AI text:", yelpText.substring(0, 100) + "...");

        // 2. NVIDIA parsing (server-side)
        let detailedData: DetailedAreaData = {
            name: area,
            scorecard: {
                total: 0,
                saturation: 0,
                demographics: 0,
                gaps: 0,
                traffic: 0,
            },
            competitors: [],
            demographics: [],
            gaps: [],
            traffic: { weekday: "", weekend: "", peak_hours: "" },
            success_factors: [],
        };

        if (yelpText) {
            try {
                const nvidiaClient = await getNvidiaClient();
                const parsePrompt = PARSE_DETAILED_AREA_PROMPT(yelpText);

                const completion = await nvidiaClient.chat.completions.create({
                    model: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
                    messages: [
                        { role: "system", content: "/no_think" },
                        { role: "user", content: parsePrompt },
                    ],
                    temperature: 0,
                    max_tokens: 4000,
                    stream: false,
                });

                let jsonString = completion.choices[0].message.content!;
                console.log(jsonString);

                jsonString = jsonString
                    .replace(/```/g, "") // ✅ CLOSED
                    .replace(/```[\s\n\r\t]*$/gi, "") // ✅ CLOSED
                    .replace(/^\s+|\s+$/g, "") // ✅ CLOSED
                    .trim();

                // Remove any prefix before the first '{'
                const firstBrace = jsonString.indexOf("{");
                if (firstBrace > 0) {
                    jsonString = jsonString.substring(firstBrace);
                }

                console.log(
                    "🧠 CLEANED JSON:",
                    jsonString.substring(0, 100) + "..."
                );

                detailedData = JSON.parse(jsonString); // Direct object
                console.log("✅ Parsed:", detailedData.scorecard.total);
            } catch (nvidiaError) {
                console.warn("NVIDIA failed:", nvidiaError);
                // detailedData stays as fallback (name: area is correct)
            }
        }

        return NextResponse.json({
            data: detailedData,
            yelpText, // Debug
        });
    } catch (error: any) {
        console.error("Yelp AI + NVIDIA error:", error);
        return NextResponse.json({
            data: {
                name: area, // ✅ Uses top-level var
                scorecard: {
                    total: 0,
                    saturation: 0,
                    demographics: 0,
                    gaps: 0,
                    traffic: 0,
                },
                competitors: [],
                demographics: [],
                gaps: [],
                traffic: { weekday: "", weekend: "", peak_hours: "" },
                success_factors: [],
            },
            yelpText: "",
        });
    }
}
