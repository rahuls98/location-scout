"use client";

import { useSearchParams } from "next/navigation";
import { ExplorePage } from "@/components/explore/explore-page";

export default function ExploreRoute() {
    const searchParams = useSearchParams();
    const business = searchParams.get("business") || "Coffee shop";
    const location = searchParams.get("location") || "Somerville, MA";

    return <ExplorePage business={business} location={location} />;
}
