"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { FeatureCard } from "@/components/landing/feature-card";

export default function HomePage() {
    const router = useRouter();
    const [business, setBusiness] = useState("");
    const [location, setLocation] = useState("");

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams({ business, location });
        router.push(`/explore?${params.toString()}`);
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col">
            {/* Reusable Header */}
            <Header />

            {/* Main */}
            <main className="flex w-full flex-1 flex-col items-center">
                <div className="flex w-full max-w-[1440px] flex-col px-10">
                    {/* Hero section */}
                    <section className="flex flex-col items-center gap-8 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <h1 className="text-5xl font-black leading-tight tracking-tighter text-text-primary-light">
                                Let Yelp AI find your next location.
                            </h1>
                        </div>

                        <div className="w-full max-w-3xl text-left">
                            <Card className="flex flex-col gap-6 rounded-xl border border-border-light bg-surface-light p-6 shadow-soft">
                                <form
                                    className="flex flex-col gap-6"
                                    onSubmit={onSubmit}
                                >
                                    <div className="flex w-full flex-wrap items-end gap-4">
                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="pb-2 text-base font-medium text-text-primary-light">
                                                What kind of business are you
                                                opening?
                                            </p>
                                            <Input
                                                className="h-12 border-border-light bg-background-light text-text-primary-light placeholder:text-text-secondary-light"
                                                placeholder="e.g. specialty coffee shop, pilates studio"
                                                value={business}
                                                onChange={(e) =>
                                                    setBusiness(e.target.value)
                                                }
                                                required
                                            />
                                        </label>

                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="pb-2 text-base font-medium text-text-primary-light">
                                                Where are you looking?
                                            </p>
                                            <Input
                                                className="h-12 border-border-light bg-background-light text-text-primary-light placeholder:text-text-secondary-light"
                                                placeholder="City, State (e.g. Portland, OR)"
                                                value={location}
                                                onChange={(e) =>
                                                    setLocation(e.target.value)
                                                }
                                                required
                                            />
                                        </label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-bold text-white hover:bg-primary-hover"
                                    >
                                        <span className="truncate">
                                            Find locations with Yelp AI
                                        </span>
                                    </Button>

                                    <p className="text-center text-sm font-normal text-text-secondary-light">
                                        Powered by Yelp business and review
                                        data.
                                    </p>
                                </form>
                            </Card>
                        </div>
                    </section>

                    {/* Features row */}
                    <section className="w-full pb-24">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <FeatureCard
                                icon="bar_chart"
                                title="Market saturation at a glance"
                                text="See how crowded each pocket of the city is for your business type."
                            />
                            <FeatureCard
                                icon="group"
                                title="Customer fit"
                                text="Check if locals match the customers you want."
                            />
                            <FeatureCard
                                icon="auto_awesome"
                                title="Yelp AI recommendations"
                                text="Get top area picks, scored and explained in plain English."
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
