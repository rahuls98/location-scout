"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import Link from "next/link";

interface Competitor {
    id: string | number;
    lat: number;
    lng: number;
    name: string;
    rating: number;
}

interface MapLeafletProps {
    competitors: Competitor[];
    onMapReady?: (map: L.Map) => void;
}

function MapController({ onMapReady }: { onMapReady?: (map: L.Map) => void }) {
    const map = useMap();
    useEffect(() => {
        if (onMapReady) onMapReady(map);
    }, [map, onMapReady]);
    return null;
}

// ✅ Fix icons ONCE at module level
if (typeof window !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
}

const RedCircleIcon = L.divIcon({
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
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

export default function MapLeaflet({
    competitors,
    onMapReady,
}: MapLeafletProps) {
    // ✅ SAFE center with NYC default
    const validMarkers = competitors.filter(
        (c) =>
            !isNaN(c.lat) &&
            !isNaN(c.lng) &&
            Math.abs(c.lat) > 0 &&
            Math.abs(c.lng) > 0
    );

    const mapCenter: [number, number] =
        validMarkers.length > 0
            ? [validMarkers[0].lat, validMarkers[0].lng]
            : [40.7128, -74.006];

    console.log(
        `🗺️ Rendering ${validMarkers.length} markers at [${mapCenter[0]}, ${mapCenter[1]}]`
    );

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                zoomControl={true}
            >
                {/* ✅ WORKING TileLayer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController onMapReady={onMapReady} />

                {validMarkers.slice(0, 50).map((comp) => (
                    <Marker
                        key={comp.id}
                        position={[comp.lat, comp.lng]}
                        icon={RedCircleIcon}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-sm mb-1">
                                    {comp.name}
                                </h3>
                                <p className="text-sm font-medium text-red-600">
                                    {comp.rating} ★
                                </p>
                                <a
                                    href={`https://yelp.com/biz/${comp.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline mt-1 block"
                                >
                                    View on Yelp
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
