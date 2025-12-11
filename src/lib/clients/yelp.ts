// lib/clients/yelp.ts
import axios from "axios";

const YELP_V3_BASE = "https://api.yelp.com/v3";
const YELP_AI_BASE = "https://api.yelp.com";

export async function getYelpV3Client() {
    const apiKey = process.env.YELP_API_KEY;
    if (!apiKey) throw new Error("YELP_API_KEY missing from server env");

    return axios.create({
        baseURL: YELP_V3_BASE,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
    });
}

export async function getYelpAIClient() {
    const apiKey = process.env.YELP_API_KEY;
    if (!apiKey) throw new Error("YELP_API_KEY missing from server env");

    return axios.create({
        baseURL: YELP_AI_BASE,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
}
