import OpenAI from "openai";

const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1";

export const nvidiaClient = new OpenAI({
    baseURL: NVIDIA_BASE,
    apiKey: process.env.NVIDIA_API_KEY!,
});
