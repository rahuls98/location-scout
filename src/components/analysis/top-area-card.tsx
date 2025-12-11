"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { TopArea } from "@/lib/domain/types";

interface TopAreaCardProps {
    rank: number;
    area: TopArea;
    business: string;
    location: string;
}

export function TopAreaCard({
    rank,
    area,
    business,
    location,
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
            <div className="flex items-start justify-between gap-4 min-h-[3rem]">
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

            <ul className="list-disc space-y-1 pl-5 text-sm marker:text-muted-foreground">
                <li>
                    <span className="font-medium text-foreground">
                        {area.saturation} saturation
                    </span>{" "}
                    • {area.competitors} competitors
                </li>
                <li className="font-medium text-foreground">
                    {area.gaps?.[0] ?? "Strong local demand"}
                </li>
                <li className="font-medium text-foreground">
                    {area.gaps?.[1] ?? "Room for differentiation"}
                </li>
            </ul>

            <p className="text-xs text-muted-foreground">
                Est. rent: {area.rent} • Foot traffic: {area.traffic}
            </p>

            <Link
                href={`/detailed-analysis/${encodeURIComponent(
                    business
                )}/${encodeURIComponent(location)}/area/${encodeURIComponent(
                    area.name
                )}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                View detailed analysis →
            </Link>
        </div>
    );
}
