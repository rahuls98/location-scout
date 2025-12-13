// src/lib/domain/types.ts

export interface AnalysisInput {
    business: string;
    location: string;
}

export interface AnalysisResult {
    metrics: SummaryMetrics;
    topAreas: TopArea[];
    competitors: YelpBusiness[];
}

export interface DetailedAreaData {
    name: string;
    competitors: Array<{
        name: string;
        rating: number;
        reviews: number;
        price: string;
        url?: string;
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

export interface TopArea {
    name: string;
    score: number;
    saturation: "Low" | "Medium" | "High";
    competitors: number;
    fit: "Perfect" | "Good" | "Moderate";
    gaps: [string, string];
    rent: string;
    traffic: "High" | "Very High" | "Medium";
    latitude: number;
    longitude: number;
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

export interface CustomerReviewInsightsInput {
    query: string;
    business: string;
    area: string;
    location: string;
}

export interface CustomerReviewInsightsResponse {
    query: string;
    business: string;
    area: string;
    location: string;
    insights: string;
}

export interface ServiceOfferingInsightsInput {
    business: string;
    area: string;
    location: string;
}
