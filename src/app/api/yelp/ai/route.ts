import { NextRequest, NextResponse } from "next/server";
import { getYelpAIClient } from "@/lib/clients/yelp";
import { getNvidiaClient } from "@/lib/clients/nvidia";
import { TopArea } from "@/lib/analysis/types";
import { PARSE_TOP_AREAS_PROMPT } from "@/lib/analysis/prompts";

export async function POST(request: NextRequest) {
    try {
        const { business, location } = await request.json();

        // 1. Get Yelp AI response
        const aiClient = await getYelpAIClient();
        const { data } = await aiClient.post("/ai/chat/v2", {
            request_context: { skip_text_generation: false },
            query: `Top 3 neighborhoods in ${location} for ${business}`,
        });

        const yelpText = data.response?.text || "";
        console.log("🤖 Yelp AI text:", yelpText.substring(0, 100) + "...");

        // 2. NVIDIA parsing (SERVER-SIDE - NO CORS)
        let topAreas: TopArea[] = [];
        if (yelpText) {
            try {
                const nvidiaClient = await getNvidiaClient();
                const parsePrompt = PARSE_TOP_AREAS_PROMPT(yelpText);

                const completion = await nvidiaClient.chat.completions.create({
                    model: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
                    messages: [
                        { role: "system", content: "/no_think" },
                        { role: "user", content: parsePrompt },
                    ],
                    temperature: 0,
                    max_tokens: 2000,
                    stream: false,
                });

                let jsonString = completion.choices[0].message.content!;
                console.log(jsonString);

                jsonString = jsonString
                    .replace(/```/g, "") // ✅ CLOSED
                    .replace(/```[\s\n\r\t]*$/gi, "") // ✅ CLOSED
                    .replace(/^\s+|\s+$/g, "") // ✅ CLOSED
                    .trim();

                console.log(
                    "🧠 Raw NVIDIA:",
                    jsonString.substring(0, 100) + "..."
                );
                topAreas = JSON.parse(jsonString).topAreas;
                console.log("🧠 Parsed:", topAreas.length, "areas");
            } catch (nvidiaError) {
                console.warn("NVIDIA failed:", nvidiaError);
            }
        }

        // ✅ Return parsed TopArea JSON directly!
        return NextResponse.json({
            topAreas,
            yelpText, // Debug
        });
    } catch (error: any) {
        console.error("Yelp AI + NVIDIA error:", error);
        return NextResponse.json({ topAreas: [], yelpText: "" });
    }
}
