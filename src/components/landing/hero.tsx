// components/landing/hero.tsx
"use client";

export function Hero() {
    return (
        <section className="flex flex-col items-start gap-4 text-left">
            <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Find the best neighborhood for your next location.
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Location Scout uses Yelp businesses and reviews to score
                neighborhoods, reveal gaps, and highlight where your concept is
                most likely to work.
            </p>
        </section>
    );
}
