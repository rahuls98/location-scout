// app/page.tsx
"use client";

import { Header } from "@/components/layout/header";
import { Hero } from "@/components/landing/hero";
import { SearchForm } from "@/components/landing/search-form";
import { Features } from "@/components/landing/features";

export default function HomePage() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            <Header />
            <main className="flex-1 overflow-y-auto flex w-full flex-col items-center">
                <div className="flex w-full max-w-6xl flex-col px-6 pb-16 pt-10 md:px-10 md:pt-16">
                    <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1fr)] items-start">
                        <div className="flex flex-col gap-8 pr-0 md:pr-4">
                            <Hero />
                            <Features />
                        </div>

                        <div className="hidden md:flex h-full justify-center">
                            <div className="h-full w-px bg-border" />
                        </div>

                        <div className="flex flex-col pt-6 md:pt-0 md:pl-4">
                            <SearchForm />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
