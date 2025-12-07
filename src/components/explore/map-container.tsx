"use client";

import dynamic from "next/dynamic";

interface MapContainerProps {
    onMapReady?: (map: any) => void;
}

const MapLeafletNoSSR = dynamic(() => import("./map-leaflet"), {
    ssr: false,
    loading: () => <div className="h-full bg-muted animate-pulse rounded-lg" />,
});

// map-container.tsx
const competitors = [
    // Downtown cluster (17 competitors) - around [45.52, -122.67]
    {
        id: 1,
        lat: 45.5215,
        lng: -122.6705,
        name: "Stumptown Coffee",
        rating: 4.6,
    },
    { id: 2, lat: 45.522, lng: -122.671, name: "Heart Coffee", rating: 4.7 },
    { id: 3, lat: 45.5208, lng: -122.6698, name: "Never Coffee", rating: 4.5 },
    { id: 4, lat: 45.5218, lng: -122.6722, name: "Coava Coffee", rating: 4.4 },
    { id: 5, lat: 45.5223, lng: -122.6701, name: "Good Coffee", rating: 4.3 },
    { id: 6, lat: 45.5202, lng: -122.6715, name: "Barista PDX", rating: 4.8 },
    { id: 7, lat: 45.5211, lng: -122.6689, name: "Bean There", rating: 4.2 },
    { id: 8, lat: 45.5225, lng: -122.672, name: "Daily Grind", rating: 4.6 },
    { id: 9, lat: 45.5205, lng: -122.6708, name: "Roasters", rating: 4.1 },
    { id: 10, lat: 45.5219, lng: -122.6695, name: "Brew Lab", rating: 4.7 },
    { id: 11, lat: 45.5221, lng: -122.6718, name: "Java Joint", rating: 4.4 },
    { id: 12, lat: 45.5209, lng: -122.6702, name: "Cuppa Joe", rating: 4.5 },
    { id: 13, lat: 45.5217, lng: -122.6725, name: "Mug Life", rating: 4.3 },
    { id: 14, lat: 45.5224, lng: -122.6692, name: "Bean Scene", rating: 4.6 },
    { id: 15, lat: 45.5206, lng: -122.6712, name: "Perk Up", rating: 4.2 },
    {
        id: 16,
        lat: 45.5214,
        lng: -122.6709,
        name: "Espresso Yourself",
        rating: 4.8,
    },
    {
        id: 17,
        lat: 45.5222,
        lng: -122.6716,
        name: "Grounds for Success",
        rating: 4.4,
    },

    // Pearl District cluster (12 competitors) - around [45.53, -122.66]
    { id: 18, lat: 45.5302, lng: -122.6605, name: "Pearl Brew", rating: 4.5 },
    {
        id: 19,
        lat: 45.5308,
        lng: -122.6612,
        name: "District Coffee",
        rating: 4.6,
    },
    { id: 20, lat: 45.5298, lng: -122.6598, name: "Urban Grind", rating: 4.3 },
    { id: 21, lat: 45.5311, lng: -122.662, name: "Pearl Perk", rating: 4.7 },
    { id: 22, lat: 45.5305, lng: -122.6601, name: "City Roast", rating: 4.4 },
    {
        id: 23,
        lat: 45.5295,
        lng: -122.6615,
        name: "Gallery Coffee",
        rating: 4.2,
    },
    { id: 24, lat: 45.5313, lng: -122.6599, name: "Loft Brew", rating: 4.6 },
    { id: 25, lat: 45.53, lng: -122.6623, name: "Artisan Bean", rating: 4.5 },
    {
        id: 26,
        lat: 45.5315,
        lng: -122.6608,
        name: "District Drip",
        rating: 4.3,
    },
    { id: 27, lat: 45.5297, lng: -122.661, name: "Pearl Press", rating: 4.4 },
    { id: 28, lat: 45.5307, lng: -122.6595, name: "Urban Cup", rating: 4.7 },
    { id: 29, lat: 45.531, lng: -122.6621, name: "Brew District", rating: 4.5 },

    // SE Division cluster (9 competitors) - around [45.51, -122.68]
    {
        id: 30,
        lat: 45.5105,
        lng: -122.6802,
        name: "Division Coffee",
        rating: 4.4,
    },
    { id: 31, lat: 45.5112, lng: -122.681, name: "SE Brew", rating: 4.3 },
    { id: 32, lat: 45.5101, lng: -122.6795, name: "Street Bean", rating: 4.5 },
    {
        id: 33,
        lat: 45.5115,
        lng: -122.6808,
        name: "Division Drip",
        rating: 4.2,
    },
    {
        id: 34,
        lat: 45.5108,
        lng: -122.6815,
        name: "Eastside Espresso",
        rating: 4.6,
    },
    { id: 35, lat: 45.5098, lng: -122.68, name: "SE Perk", rating: 4.4 },
    {
        id: 36,
        lat: 45.511,
        lng: -122.6792,
        name: "Neighborhood Roast",
        rating: 4.3,
    },
    {
        id: 37,
        lat: 45.5103,
        lng: -122.682,
        name: "Division Grounds",
        rating: 4.5,
    },
    { id: 38, lat: 45.5118, lng: -122.6805, name: "SE Cup", rating: 4.1 },

    // Scattered competitors (14 more for total 52)
    { id: 39, lat: 45.525, lng: -122.685, name: "Scattered Brew", rating: 4.3 },
    { id: 40, lat: 45.535, lng: -122.675, name: "North Coffee", rating: 4.5 },
    { id: 41, lat: 45.505, lng: -122.69, name: "South Bean", rating: 4.2 },
    { id: 42, lat: 45.54, lng: -122.665, name: "Upper Brew", rating: 4.6 },
    { id: 43, lat: 45.515, lng: -122.695, name: "West Cup", rating: 4.4 },
    { id: 44, lat: 45.528, lng: -122.655, name: "East Roast", rating: 4.3 },
    { id: 45, lat: 45.532, lng: -122.692, name: "Northwest Drip", rating: 4.5 },
    { id: 46, lat: 45.508, lng: -122.665, name: "Southeast Perk", rating: 4.2 },
    {
        id: 47,
        lat: 45.542,
        lng: -122.678,
        name: "Far North Coffee",
        rating: 4.6,
    },
    { id: 48, lat: 45.498, lng: -122.682, name: "Far South Brew", rating: 4.4 },
    { id: 49, lat: 45.526, lng: -122.705, name: "Westside Bean", rating: 4.3 },
    { id: 50, lat: 45.534, lng: -122.645, name: "Eastside Cup", rating: 4.5 },
    { id: 51, lat: 45.512, lng: -122.655, name: "Central Roast", rating: 4.2 },
    { id: 52, lat: 45.538, lng: -122.688, name: "North Central", rating: 4.6 },
];

const clusters = [
    { lat: 45.52, lng: -122.67, count: 17, color: "danger" }, // Downtown
    { lat: 45.53, lng: -122.66, count: 12, color: "warning" }, // Pearl District
    { lat: 45.51, lng: -122.68, count: 9, color: "secondary" }, // SE Division
];

export function MapContainerComponent({ onMapReady }: MapContainerProps) {
    return (
        <main className="relative flex-1 min-h-0">
            <MapLeafletNoSSR
                competitors={competitors}
                clusters={clusters}
                onMapReady={onMapReady}
            />
        </main>
    );
}
