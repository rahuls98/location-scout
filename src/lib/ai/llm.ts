// lib/ai/llm.ts

import { getNvidiaClient } from "@/lib/clients/nvidia";
import { PARSE_TOP_AREAS_PROMPT, PARSE_DETAILED_AREA_PROMPT } from "./prompts";
import type { TopArea, DetailedAreaData } from "../domain/types";

/**
 * Normalizes LLM output that may contain Markdown fences or extra text.
 * Optionally trims to the outermost JSON object braces.
 */
function cleanJson(raw: string, ensureObject = false): string {
    let cleaned = raw.trim();

    // Collapse any long ```
    cleaned = cleaned.replace(/`{3,}/g, "```");

    if (cleaned.includes("```")) {
        const parts = cleaned.split("```");

        // Heuristic: take the largest fenced block.
        let best = "";
        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.length > best.length) best = trimmed;
        }
        cleaned = best || cleaned;
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

/**
 * Parses LLM output into a TopArea[] list from raw Yelp AI text.
 */
export async function parseTopAreasWithLLM(
    yelpText: string
): Promise<TopArea[]> {
    if (!yelpText) return [];

    try {
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

        const content = completion.choices[0]?.message?.content ?? "";
        const jsonString = cleanJson(content);
        const parsed = JSON.parse(jsonString) as { topAreas?: TopArea[] };

        return Array.isArray(parsed.topAreas) ? parsed.topAreas : [];
    } catch (error) {
        console.warn("parseTopAreasWithLLM failed:", error);
        return [];
    }
}

/**
 * Parses LLM output into a rich DetailedAreaData object, with a safe fallback.
 */
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

        const content = completion.choices[0]?.message?.content ?? "";
        const jsonString = cleanJson(content, true);

        return JSON.parse(jsonString) as DetailedAreaData;
    } catch (error) {
        console.warn("parseDetailedAreaWithLLM failed:", error);
        return fallback;
    }
}
