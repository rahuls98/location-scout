import OpenAI from "openai";

const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1";

export async function getNvidiaClient(): Promise<OpenAI> {
    const apiKey =
        typeof window !== "undefined"
            ? process.env.NEXT_PUBLIC_NVIDIA_API_KEY
            : process.env.NVIDIA_API_KEY;

    if (!apiKey) {
        throw new Error(
            typeof window !== "undefined"
                ? "NEXT_PUBLIC_NVIDIA_API_KEY missing"
                : "NVIDIA_API_KEY missing"
        );
    }

    return new OpenAI({
        apiKey,
        baseURL: NVIDIA_BASE,
        // ✅ REQUIRED for client-side NVIDIA
        dangerouslyAllowBrowser: true,
    });
}
