import OpenAI from "openai";

const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1";

export async function getNvidiaClient(): Promise<OpenAI> {
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
        throw new Error("NVIDIA_API_KEY missing from server env");
    }

    return new OpenAI({
        apiKey,
        baseURL: NVIDIA_BASE,
    });
}
