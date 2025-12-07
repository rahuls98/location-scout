"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useRef, useCallback } from "react";
import "leaflet/dist/leaflet.css";

interface Competitor {
    id: number;
    lat: number;
    lng: number;
    name: string;
    rating: number;
}

interface Cluster {
    lat: number;
    lng: number;
    count: number;
    color: string;
}

interface MapLeafletProps {
    competitors: Competitor[];
    clusters: Cluster[];
    onMapReady?: (map: any) => void;
}

export default function MapLeaflet({
    competitors,
    clusters,
    onMapReady,
}: MapLeafletProps) {
    const mapRef = useRef<any>(null);

    const handleMapReady = useCallback(
        (map: any) => {
            onMapReady?.(map);
        },
        [onMapReady]
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const loadMap = async () => {
            const L = (await import("leaflet")) as any;

            // Fix icons once
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                iconUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            });

            const map = mapRef.current;
            if (!map) return;

            handleMapReady(map);

            // Clear layers
            map.eachLayer((layer: any) => {
                if (
                    layer instanceof L.LayerGroup ||
                    layer instanceof L.CircleMarker
                ) {
                    map.removeLayer(layer);
                }
            });

            // Competitor pins - Yelp red
            const competitorGroup = L.layerGroup();
            competitors.slice(0, 20).forEach((comp) => {
                const marker = L.marker([comp.lat, comp.lng], {
                    icon: L.divIcon({
                        html: `
                            <div style="
                                width: 12px; height: 12px; 
                                background: #D32323; 
                                border: 2px solid #FFFFFF; 
                                border-radius: 50%; 
                                box-shadow: 0 2px 8px rgba(211, 35, 35, 0.4);
                            "></div>
                        `,
                        className: "p-0 m-0",
                        iconSize: [12, 12],
                        iconAnchor: [6, 6],
                    }),
                }).bindPopup(`
                    <div style="padding: 12px; min-width: 200px;">
                        <h3 style="font-weight: bold; font-size: 16px; margin: 0 0 4px 0; color: #1a1a1a;">${comp.name}</h3>
                        <p style="margin: 0; font-size: 14px; color: #666;">${comp.rating} ★</p>
                    </div>
                `);
                competitorGroup.addLayer(marker);
            });
            competitorGroup.addTo(map);
        };

        loadMap();
    }, [competitors, clusters, handleMapReady]);

    return (
        <MapContainer
            center={[45.5231, -122.6765]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            className="h-full w-full rounded-none border-none"
            zoomControl={true}
            ref={mapRef}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
}
