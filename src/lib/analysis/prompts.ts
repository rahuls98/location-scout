export const TOP_AREAS_PROMPT = (business: string, location: string): string =>
    `
Top 3 neighborhoods in ${location} for ${business}. For each:

1. **Name** 
2. **Saturation**: Low(≤3), Medium(4-12), High(>12) competitors
3. **Fit**: Perfect/Good/Moderate customer fit
4. **2 market gaps** (from negative reviews)
5. **Rent**: "$X-Yk/mo" 
6. **Traffic**: High/Very High/Medium
7. **Score**: X/10

Format:
1. [NAME] - [X.X/10] - [Low/Medium/High] saturation ([#] comp) - [Perfect/Good/Moderate] fit - Gap1, Gap2 - $[X-Yk]/mo - [Traffic]
`.trim();

export const PARSE_TOP_AREAS_PROMPT = (yelpResponse: string): string =>
    `
Parse to EXACT JSON for TopAreaCard:

${yelpResponse}

{
  "topAreas": [
    {
      "name": "Fenway/Kenmore Square",
      "score": 8.7,
      "saturation": "Low",
      "competitors": 3,
      "fit": "Perfect",
      "gaps": ["Staff friendliness issues", "Inconsistent coffee quality"],
      "rent": "$7k-15k/mo",
      "traffic": "Very High"
    }
  ]
}

Rules:
- saturation: "Low"/"Medium"/"High" 
- fit: "Perfect"/"Good"/"Moderate"
- gaps: EXACTLY 2 strings from market gaps
- competitors: parse NUMBER only
- score: NUMBER (8.7 → 8.7)
- Return ONLY valid JSON
`.trim();

// src/lib/analysis/prompts.ts - ✅ RENT REMOVED FROM PARSE PROMPT
export const PARSE_DETAILED_AREA_PROMPT = (yelpResponse: string): string =>
    `
Parse to EXACT JSON for DetailedAreaPage:

${yelpResponse}

{
  "name": "Highland Ave",
  "scorecard": {"total": 8.2, "saturation": 7, "demographics": 9, "gaps": 8.5, "traffic": 9},
  "competitors": [{"name": "3 Little Figs", "rating": 4.5, "reviews": 719, "price": "$$"}],
  "demographics": [{"type": "Age", "value": "25-40"}],
  "gaps": [{"title": "Seating", "description": "Limited weekend seating"}],
  "traffic": {"weekday": "Morning rush", "weekend": "High brunch", "peak_hours": "8-11AM"},
  "success_factors": ["Unique menu", "Friendly service"]
}

Rules:
- Extract ALL competitors (name, rating, reviews, price)
- Parse ALL scorecard numbers
- gaps: title + description from each bullet  
- Return ONLY valid JSON, don't include any other text apart from JSON.
`.trim();
