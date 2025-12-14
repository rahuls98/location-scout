// components/landing/search-form.tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandEmpty,
    CommandGroup,
} from "@/components/ui/command";

type StatesCitiesJson = Record<string, string[]>;

interface LocationOption {
    value: string; // "City, State"
    label: string; // "City, State"
    state: string;
    city: string;
}

const LOCATION_JSON_URL =
    "https://gist.githubusercontent.com/ahmu83/38865147cf3727d221941a2ef8c22a77/raw/c647f74643c0b3f8407c28ddbb599e9f594365ca/US_States_and_Cities.json";

export function SearchForm() {
    const router = useRouter();

    const [business, setBusiness] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [cityState, setCityState] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [openLocation, setOpenLocation] = useState(false);
    const [locationQuery, setLocationQuery] = useState("");
    const [locations, setLocations] = useState<LocationOption[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        async function loadLocations() {
            try {
                setLoadingLocations(true);
                setLoadError(null);

                const res = await fetch(LOCATION_JSON_URL);
                if (!res.ok) {
                    throw new Error(`Failed to load locations: ${res.status}`);
                }

                const json = (await res.json()) as StatesCitiesJson;

                const options: LocationOption[] = [];
                for (const [state, cities] of Object.entries(json)) {
                    cities.forEach((city) => {
                        const full = `${city}, ${state}`;
                        options.push({
                            value: full,
                            label: full,
                            state,
                            city,
                        });
                    });
                }

                setLocations(options);
            } catch (err) {
                const msg =
                    err instanceof Error
                        ? err.message
                        : "Failed to load locations";
                console.error("Location JSON load error:", err);
                setLoadError(msg);
            } finally {
                setLoadingLocations(false);
            }
        }

        loadLocations();
    }, []);

    const filteredLocations = useMemo(() => {
        const q = locationQuery.trim().toLowerCase();
        if (!q) return locations.slice(0, 25);

        return locations
            .filter(
                (opt) =>
                    opt.city.toLowerCase().includes(q) ||
                    opt.state.toLowerCase().includes(q) ||
                    opt.label.toLowerCase().includes(q)
            )
            .slice(0, 25);
    }, [locationQuery, locations]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const b = business.trim();
        const n = neighborhood.trim();
        const l = cityState.trim();
        if (!b || !l) return;

        const match = locations.find((opt) => opt.value === l);
        if (!match) {
            alert("Please choose a city from the list.");
            return;
        }

        setSubmitting(true);
        const locationParam = n ? `${n}, ${l}` : l;
        const params = new URLSearchParams({
            business: b,
            location: locationParam,
        });

        router.push(`/analysis?${params.toString()}`);
    }

    const isDisabled =
        submitting || !business.trim() || !cityState.trim() || !!loadError;

    return (
        <section className="w-full">
            <Card className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm md:p-7">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="flex w-full flex-col gap-4">
                        {/* Business */}
                        <label className="flex flex-1 flex-col gap-1.5">
                            <span className="text-sm font-medium text-foreground">
                                What kind of business are you opening?
                            </span>
                            <Input
                                className="h-11 bg-background text-foreground placeholder:text-muted-foreground"
                                placeholder="e.g. specialty coffee shop, pilates studio"
                                value={business}
                                onChange={(e) => setBusiness(e.target.value)}
                                autoComplete="off"
                            />
                        </label>

                        {/* Neighborhood */}
                        <label className="flex flex-1 flex-col gap-1.5">
                            <span className="text-sm font-medium text-foreground">
                                Any specific neighborhood?
                            </span>
                            <Input
                                className="h-11 bg-background text-foreground placeholder:text-muted-foreground"
                                placeholder="e.g. Seaport District, Highland Ave (optional)"
                                value={neighborhood}
                                onChange={(e) =>
                                    setNeighborhood(e.target.value)
                                }
                                autoComplete="off"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                Leave blank to scan the whole city.
                            </p>
                        </label>

                        {/* City + State */}
                        <label className="flex flex-1 flex-col gap-1.5">
                            <span className="text-sm font-medium text-foreground">
                                Which city and state?
                            </span>

                            <Popover
                                open={openLocation}
                                onOpenChange={setOpenLocation}
                            >
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex h-11 w-full items-center justify-between rounded-md border bg-background px-3 text-left text-sm text-foreground"
                                        disabled={
                                            loadingLocations || !!loadError
                                        }
                                    >
                                        <span className="truncate">
                                            {cityState ||
                                                (loadingLocations
                                                    ? "Loading cities..."
                                                    : "City, State (from supported list)")}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search city or state..."
                                            value={locationQuery}
                                            onValueChange={setLocationQuery}
                                        />
                                        <CommandList>
                                            {loadError ? (
                                                <CommandEmpty>
                                                    Failed to load locations
                                                </CommandEmpty>
                                            ) : loadingLocations ? (
                                                <CommandEmpty>
                                                    Loading...
                                                </CommandEmpty>
                                            ) : filteredLocations.length ===
                                              0 ? (
                                                <CommandEmpty>
                                                    No results.
                                                </CommandEmpty>
                                            ) : (
                                                <CommandGroup>
                                                    {filteredLocations.map(
                                                        (opt) => (
                                                            <CommandItem
                                                                key={opt.value}
                                                                value={
                                                                    opt.label
                                                                }
                                                                onSelect={() => {
                                                                    setCityState(
                                                                        opt.value
                                                                    );
                                                                    setLocationQuery(
                                                                        opt.label
                                                                    );
                                                                    setOpenLocation(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                {opt.label}
                                                            </CommandItem>
                                                        )
                                                    )}
                                                </CommandGroup>
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Must match one of the supported U.S. cities.
                            </p>
                        </label>
                    </div>

                    <Button
                        type="submit"
                        disabled={isDisabled}
                        className="flex h-11 w-full items-center justify-center text-base font-semibold"
                    >
                        <span className="truncate">
                            {submitting
                                ? "Analyzing neighborhoods..."
                                : "Find neighborhoods with Yelp AI"}
                        </span>
                    </Button>

                    <p className="text-center text-xs text-muted-foreground md:text-sm">
                        Uses Yelp business and review data in real time.
                    </p>
                </form>
            </Card>
        </section>
    );
}
