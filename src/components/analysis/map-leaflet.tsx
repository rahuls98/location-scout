"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
        if (!onMapReady) return;
        onMapReady(map);
    }, [map, onMapReady]);

    return null;
}

// Fix Leaflet default icons on client
if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const redCircleIcon = new L.DivIcon({
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
    const validMarkers = useMemo(
        () =>
            competitors.filter(
                (c) =>
                    Number.isFinite(c.lat) &&
                    Number.isFinite(c.lng) &&
                    Math.abs(c.lat) > 0 &&
                    Math.abs(c.lng) > 0
            ),
        [competitors]
    );

    const mapCenter: [number, number] =
        validMarkers.length > 0
            ? [validMarkers[0].lat, validMarkers[0].lng]
            : [40.7128, -74.006];

    return (
        <div className="h-full w-full">
            <MapContainer
                center={mapCenter}
                zoom={13}
                className="h-full w-full"
                zoomControl
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController onMapReady={onMapReady} />

                {validMarkers.slice(0, 50).map((comp) => (
                    <Marker
                        key={comp.id}
                        position={[comp.lat, comp.lng]}
                        icon={redCircleIcon}
                    >
                        <Popup>
                            <div className="min-w-[200px] p-1">
                                <h3 className="mb-1 text-sm font-semibold">
                                    {comp.name}
                                </h3>
                                <span className="text-sm font-medium text-primary">
                                    {comp.rating.toFixed(1)} ★
                                </span>
                                <a
                                    href={`https://yelp.com/biz/${comp.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 block text-xs text-primary hover:underline"
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
