// lib/ai/prompts.ts - Prompts for Yelp AI + NVIDIA

export const TOP_AREAS_YELP_PROMPT = (
    business: string,
    location: string
): string =>
    `You are a local market analyst.

List the **top 3 neighborhoods in ${location} for opening a ${business}**. For each area, you MUST provide:

1. Name
2. Saturation: Low(≤3), Medium(4-12), High(>12) competitors
3. Market gaps: Exactly 2 specific gaps inferred from negative reviews or obvious missing offerings
4. Approximate rent range: "$Xk-Yk/mo"
5. Approximate foot traffic: Very High / High / Medium / Low
6. Overall score: X.X/10
7. Latitude,Longitude

Format EACH line exactly like this, with no extra text before or after:

[NAME] - [X.X/10] - [Low/Medium/High] ([#] comp) - Gap1, Gap2 - $[Xk-Yk]/mo - [Traffic] - [Latitude,Longitude]

Rules:
- Always produce exactly 3 lines if possible.
- If data is missing, infer reasonable estimates instead of asking the user for more information.
- Do NOT include bullet points, headings, explanations, or commentary.
- Output ONLY the 3 formatted lines, nothing else.`.trim();

export const DETAILED_ANALYSIS_YELP_PROMPT = ({
    business,
    location,
    area,
}: {
    business: string;
    location: string;
    area: string;
}): string =>
    `Detailed analysis for ${business} in ${location}'s ${area} neighborhood:

1. Top 5 competitors: name, rating (X.X), reviews, price
2. Demographics: age range, income level, lifestyle traits, peak hours
3. Market gaps: 3-5 specific opportunities from negative reviews
4. Foot traffic: weekday patterns, weekend patterns, peak hours
5. Success factors: 3-5 reasons winners succeed here

Use clear bullet points for each section.`.trim();

export const PARSE_TOP_AREAS_PROMPT = (yelpResponse: string): string =>
    `You are a JSON generator. Convert the following Yelp AI output into a single JSON object.

The input SHOULD be 3 lines in this exact format:
[NAME] - [X.X/10] - [Low/Medium/High] ([#] comp) - Gap1, Gap2 - $[Xk-Yk]/mo - [Traffic] - [Latitude,Longitude]

If you see any extra commentary, reasoning, or text that does not match this pattern, IGNORE it and only use the lines that match the pattern.

You MUST output JSON in this exact shape:

{
  "topAreas": [
    {
      "name": string,
      "score": number,
      "saturation": "Low" | "Medium" | "High",
      "competitors": number,
      "gaps": [string, string],
      "rent": string,           // "$Xk-Yk/mo"
      "traffic": "Very High" | "High" | "Medium" | "Low"
      "latitude": number,
      "longitude": number
    }
  ]
}

Rules:
- Do NOT ask the user for more information.
- If any values (rent, traffic, score, competitors) are missing or ambiguous, make a single best guess based on the text and still fill all fields.
- "gaps" must be exactly 2 grammatically correct sentences per area. Each gap analyzes a specific market opportunity identified from negative competitor reviews or missing offerings. Make clear these are inferred from customer complaints about competitors. Use phrases like 'Customers complain about X', 'No competitor offers Y', 'Reviewers note lack of Z'. Keep concise (1 line each), non-repetitive, actionable opportunities.
- Clean gaps to be short, readable phrases (max 1 line each)
- Return ONLY the JSON object above. No markdown, no explanation, no extra keys.

Now convert this Yelp AI response:

${yelpResponse}`.trim();

export const PARSE_DETAILED_AREA_PROMPT = (yelpResponse: string): string =>
    `
You are a JSON generator. Always respond with a single valid JSON object that matches the exact schema below.
If the analysis uses different headings or wording, map them into the closest fields in this schema.

Target JSON schema:

{
  "name": string,
  "competitors": [
    {
      "name": string,
      "rating": number,
      "reviews": number,
      "price": string,
      "url": string | null,
      "price_per_sqft": number | null
    }
  ],
  "demographics": [
    {
      "type": string,
      "value": string
    }
  ],
  "gaps": [
    {
      "title": string,
      "description": string
    }
  ],
  "traffic": {
    "weekday": string,
    "weekend": string,
    "peak_hours": string
  },
  "success_factors": string[]
}

General mapping rules:
- Treat any customer segments, age, income, or lifestyle descriptions as "demographics".
- Treat any problems, complaints, or missing offerings as "gaps" (each with a short title and 1–2 sentence description).
- Treat any notes about weekday vs weekend flow, busiest times, and how people arrive as "traffic":
  - "weekday" and "weekend" are short summaries of flow and timing.
  - "peak_hours" is the clearest peak-time description.
- Treat any reasons why existing businesses do well as "success_factors" (short bullet-style phrases).
- For each competitor include: name, numeric rating, numeric review count, price string (or empty if unknown), and url/price_per_sqft as null if not given.
- If some details are missing, infer a single reasonable value rather than leaving fields out.

Output rules:
- Return ONLY one JSON object in the schema above.
- Do not include explanations, markdown, or any extra keys.

Yelp AI analysis to convert:

${yelpResponse}
`.trim();

export const CUSTOMER_REVIEW_INSIGHTS_YELP_PROMPT = ({
    query,
    business,
    area,
    location,
}: {
    query: string;
    business: string;
    area: string;
    location: string;
}): string =>
    `Summarize what customer reviews for businesses in the ${business} market in and around ${area} (near ${location}) say about ${query}. Don't list locations"`.trim();

export const OFFERING_INSIGHTS_YELP_PROMPT = ({
    business,
    area,
    location,
}: {
    business: string;
    area: string;
    location: string;
}): string =>
    `Summarize service offering insights for ${business} in and around ${area} (near ${location}), focusing on how well services meet expectations and perceived value for money. 
Look at recent reviews and produce one cohesive, plain-English paragraph that combines: 
(1) themes where customers “want more” from the experience (e.g., missing services, lack of personalization or atmosphere), and 
(2) themes where customers feel they did not get their money's worth (e.g., rushed cuts, inconsistent quality, pricing vs. outcome). 
Do not mention specific business names or locations. 
Also briefly suggest 2-3 concrete service or experience improvements that could address both types of concerns.`.trim();
