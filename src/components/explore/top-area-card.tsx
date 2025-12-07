"use client";

import { Icon } from "@/components/icon";

interface TopAreaCardProps {
    rank: number;
    area: any;
}

export function TopAreaCard({ rank, area }: TopAreaCardProps) {
    const getColor = (score: number) => {
        if (score >= 8)
            return { bg: "success", text: "success", icon: "trending_up" };
        if (score >= 6.5)
            return { bg: "warning", text: "warning", icon: "trending_up" };
        return { bg: "danger", text: "danger", icon: "trending_flat" };
    };

    const color = getColor(area.score);

    return (
        <div
            className={`group flex flex-col gap-4 rounded-xl p-5 shadow-soft transition-all border border-border-light`}
        >
            <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold text-text-primary-light">
                    #{rank} – {area.name}
                </h3>
                <div
                    className={`flex items-center gap-2 rounded-full bg-${color.bg}/10 px-3 py-1 text-xs font-semibold text-${color.text}`}
                >
                    <Icon name={color.icon} className="text-base" />
                    <span>{area.score} / 10</span>
                </div>
            </div>

            {/* ✅ FILLED BULLETS - Google Stitch exact */}
            <ul className="flex flex-col gap-2 pl-5 list-disc text-sm marker:text-text-primary-light">
                <li>
                    <span className="font-medium text-text-primary-light">
                        {area.saturation} saturation
                    </span>
                    : {area.competitors || 2} similar competitors
                </li>
                <li>
                    <span className="font-medium text-text-primary-light">
                        {area.fit} customer fit
                    </span>{" "}
                    with local demographics
                </li>
                <li className="font-medium text-text-primary-light">
                    {area.gaps ? area.gaps[0] : "Strong price power"}
                </li>
            </ul>

            <p className="text-xs text-text-secondary-light">
                Est. rent: {area.rent} • Foot traffic: {area.traffic}
            </p>

            <button className="text-muted-foreground hover:text-primary cursor-pointer font-medium text-sm self-start transition-colors">
                View detailed analysis →
            </button>
        </div>
    );
}
