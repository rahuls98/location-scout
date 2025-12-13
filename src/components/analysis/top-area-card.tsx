"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { TopArea } from "@/lib/domain/types";

interface TopAreaCardProps {
    rank: number;
    area: TopArea;
    business: string;
    location: string;
    onZoomToArea: (lat: number, lng: number, zoomLevel: number) => void;
}

export function TopAreaCard({
    rank,
    area,
    business,
    location,
    onZoomToArea,
}: TopAreaCardProps) {
    const color =
        area.score >= 8
            ? { badge: "bg-success/10 text-success", icon: "trending_up" }
            : area.score >= 6.5
            ? { badge: "bg-warning/10 text-warning", icon: "trending_up" }
            : {
                  badge: "bg-destructive/10 text-destructive",
                  icon: "trending_flat",
              };

    return (
        <div className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all">
            <div className="flex items-start justify-between gap-4 min-h-[2rem]">
                <h3 className="text-lg font-semibold text-foreground leading-tight break-words min-w-0 flex-1 pr-2 line-clamp-2">
                    #{rank} – {area.name}
                </h3>
                <div
                    className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${color.badge} flex-shrink-0`}
                >
                    <Icon name={color.icon} className="text-sm flex-shrink-0" />
                    <span>{area.score.toFixed(1)} / 10</span>
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                {area.saturation} saturation • {area.traffic} foot traffic •{" "}
                {area.rent} est. rent
            </p>

            <div className="font-small text-foreground text-sm">
                <div>
                    <h4 className="text-foreground mb-1 text-sm">
                        Market gaps:
                    </h4>
                    <ul className="list-disc space-y-1 pl-5 text-sm marker:text-muted-foreground">
                        <li>{area.gaps?.[0] ?? "Strong local demand"}</li>
                        <li>{area.gaps?.[1] ?? "Room for differentiation"}</li>
                    </ul>
                </div>
            </div>

            <div className="flex gap-2 text-sm font-medium text-muted-foreground">
                <Link
                    href=""
                    className="transition-colors hover:text-primary hover:underline"
                    onClick={() =>
                        onZoomToArea?.(area.latitude, area.longitude, 18)
                    }
                >
                    Zoom to area
                </Link>
                •
                <Link
                    href={`/detailed-analysis/${encodeURIComponent(
                        business
                    )}/${encodeURIComponent(
                        location
                    )}/area/${encodeURIComponent(area.name)}`}
                    className="transition-colors hover:text-primary hover:underline"
                >
                    View detailed analysis →
                </Link>
            </div>
        </div>
    );
}
