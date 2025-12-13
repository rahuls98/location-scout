"use client";

import { Icon } from "@/components/icon";

export function Header() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-light bg-white dark:bg-background px-6 py-3">
            <div className="flex w-full max-w-[1440px] items-center justify-between px-10">
                <div className="flex items-center gap-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                        <Icon name="explore" className="text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-primary">
                        Location Scout
                    </h2>
                </div>
            </div>
        </header>
    );
}
