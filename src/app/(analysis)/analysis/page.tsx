// src/app/(analysis)/analysis/page.tsx

import { Suspense } from "react";
import { SearchParamsClient } from "./search-params-client";

interface Props {
    searchParams: Promise<{ business?: string; location?: string }>;
}

export default function AnalysisRoute({ searchParams }: Props) {
    return (
        <Suspense fallback={<div></div>}>
            <SearchParamsClient searchParams={searchParams} />
        </Suspense>
    );
}
