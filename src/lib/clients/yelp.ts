import axios from "axios";

const YELP_V3_BASE = "https://api.yelp.com/v3";
const YELP_AI_BASE = "https://api.yelp.com";

export const yelpClient = axios.create({
    baseURL: YELP_V3_BASE,
    headers: { "Content-Type": "application/json" },
});

// ✅ SERVER + CLIENT V3 client
export async function getYelpV3Client() {
    const apiKey =
        typeof window !== "undefined"
            ? process.env.NEXT_PUBLIC_YELP_API_KEY
            : process.env.YELP_API_KEY; // ✅ Server fallback

    if (!apiKey) throw new Error("Yelp API key missing");

    return axios.create({
        baseURL: YELP_V3_BASE,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
    });
}

// ✅ SERVER + CLIENT AI client
export async function getYelpAIClient() {
    const apiKey =
        typeof window !== "undefined"
            ? process.env.NEXT_PUBLIC_YELP_API_KEY
            : process.env.YELP_API_KEY; // ✅ Server fallback

    if (!apiKey) throw new Error("Yelp API key missing");

    return axios.create({
        baseURL: YELP_AI_BASE, // api.yelp.com (no /v3)
        headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
}
