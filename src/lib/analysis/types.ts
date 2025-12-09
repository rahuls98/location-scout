// src/lib/analysis/types.ts - COMPLETE FIXED VERSION
export interface AnalysisInput {
    business: string;
    location: string;
}

export interface SummaryMetrics {
    competitors: number;
    hotspots: number;
    avgRating: number;
    competitorHotspots: Array<{
        name: string;
        competitors: number;
        rating: number;
        lat: number;
        lng: number;
    }>;
}

export interface TopArea {
    name: string;
    score: number;
    saturation: "Low" | "Medium" | "High";
    competitors: number;
    fit: "Perfect" | "Good" | "Moderate";
    gaps: [string, string];
    rent: string;
    traffic: "High" | "Very High" | "Medium";
}

export interface YelpBusiness {
    id: string;
    name: string;
    rating: number;
    review_count: number;
    location: {
        neighborhood?: string[];
        city: string;
        address1?: string;
        address2?: string;
        country: string;
        state: string;
        zip_code: string;
    };
    coordinates: {
        latitude: number;
        longitude: number;
    };
    categories: Array<{
        alias: string;
        title: string;
    }>;
}

export interface AnalysisResult {
    metrics: SummaryMetrics;
    topAreas: TopArea[];
    competitors: YelpBusiness[];
}

// ✅ SINGLE DetailedAreaData - FIXED DUPLICATE + CONSISTENT competitors
export interface DetailedAreaData {
    name: string;
    scorecard: {
        total: number;
        saturation: number;
        demographics: number;
        gaps: number;
        traffic: number;
    };
    competitors: Array<{
        name: string;
        rating: number;
        reviews: number;
        price: string;
        url?: string; // Optional from Yelp links
        price_per_sqft?: number; // Optional rent estimate
    }>;
    demographics: Array<{
        type: string;
        value: string;
    }>;
    gaps: Array<{
        title: string;
        description: string;
    }>;
    traffic: {
        weekday: string;
        weekend: string;
        peak_hours: string;
    };
    success_factors: string[];
}
