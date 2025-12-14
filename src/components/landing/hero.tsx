// components/landing/hero.tsx
"use client";

export function Hero() {
    return (
        <section className="flex flex-col items-start gap-4 text-left">
            <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Launch Smarter with{" "}
                <span className="text-primary">Yelp AI</span> Location
                Intelligence
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base leading-relaxed">
                Location Scout harnesses Yelp business data, real customer
                reviews, and AI-powered analysis to score neighborhoods and
                expose market gaps where your business concept has the highest
                chance of success.
            </p>
        </section>
    );
}
