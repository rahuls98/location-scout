import { Card } from "@/components/ui/card";

interface SummaryCardProps {
    competitors: number;
    hotspots: number;
    avgRating: number;
}

export function SummaryCard({
    competitors,
    hotspots,
    avgRating,
}: SummaryCardProps) {
    if (!competitors && !hotspots && !avgRating) {
        return <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />;
    }
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-text-primary-light text-lg font-semibold">
                Summary
            </h2>
            <div className="flex gap-4">
                <StatCard label="Competitors" value={competitors.toString()} />
                <StatCard label="Average rating" value={`${avgRating} ★`} />
                <StatCard label="Hotspot areas" value={hotspots.toString()} />
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-1 flex-col gap-1 rounded-lg p-4 bg-card rounded-lg border border-border-light">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="tracking-tight text-2xl font-bold text-foreground">
                {value}
            </p>
        </div>
    );
}
