// components/landing/feature-card.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icon";

interface FeatureCardProps {
    icon: string;
    title: string;
    text: string;
}

export function FeatureCard({ icon, title, text }: FeatureCardProps) {
    return (
        <Card className="flex flex-col items-center gap-4 rounded-xl border border-border-light bg-surface-light p-5 text-center shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <Icon name={icon} className="text-3xl" />
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-text-primary-light">
                    {title}
                </h3>
                <p className="text-base text-text-secondary-light">{text}</p>
            </div>
        </Card>
    );
}
