// lib/ai/llm.ts - NVIDIA helpers + JSON parsing

import { getNvidiaClient } from "@/lib/clients/nvidia";
import { PARSE_TOP_AREAS_PROMPT, PARSE_DETAILED_AREA_PROMPT } from "./prompts";
import type { TopArea, DetailedAreaData } from "../domain/types";

function cleanJson(raw: string, ensureObject = false): string {
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/`{3,}/g, "```");
    if (cleaned.includes("```")) {
        cleaned = cleaned.replace(/``````/g, "$1");
    }
    cleaned = cleaned.trim();
    if (ensureObject) {
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace > firstBrace) {
            cleaned = cleaned.slice(firstBrace, lastBrace + 1);
        }
    }
    return cleaned.trim();
}

export async function parseTopAreasWithLLM(
    yelpText: string
): Promise<TopArea[]> {
    if (!yelpText) return [];

    try {
        console.log(yelpText);
        const client = await getNvidiaClient();
        const completion = await client.chat.completions.create({
            model: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
            messages: [
                { role: "system", content: "/no_think" },
                { role: "user", content: PARSE_TOP_AREAS_PROMPT(yelpText) },
            ],
            temperature: 0,
            max_tokens: 2000,
            stream: false,
        });

        const jsonString = cleanJson(
            completion.choices[0].message.content ?? ""
        );
        const parsed = JSON.parse(jsonString) as { topAreas?: TopArea[] };
        return Array.isArray(parsed.topAreas) ? parsed.topAreas : [];
    } catch (error) {
        console.warn("parseTopAreasWithLLM failed:", error);
        return [];
    }
}

export async function parseDetailedAreaWithLLM(
    yelpText: string,
    fallbackName: string
): Promise<DetailedAreaData> {
    const fallback: DetailedAreaData = {
        name: fallbackName,
        competitors: [],
        demographics: [],
        gaps: [],
        traffic: { weekday: "", weekend: "", peak_hours: "" },
        success_factors: [],
    };

    if (!yelpText) return fallback;

    try {
        const client = await getNvidiaClient();
        const completion = await client.chat.completions.create({
            model: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
            messages: [
                { role: "system", content: "/no_think" },
                { role: "user", content: PARSE_DETAILED_AREA_PROMPT(yelpText) },
            ],
            temperature: 0,
            max_tokens: 4000,
            stream: false,
        });

        const jsonString = cleanJson(
            completion.choices[0].message.content ?? "",
            true
        );
        return JSON.parse(jsonString) as DetailedAreaData;
    } catch (error) {
        console.warn("parseDetailedAreaWithLLM failed:", error);
        return fallback;
    }
}
