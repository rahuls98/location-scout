export default function ExploreLoading() {
    return (
        <div className="flex h-[calc(100vh-72px)] bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-[440px] border-r border-gray-200 bg-white p-6 space-y-8">
                {/* Sticky header skeleton */}
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 p-5 pb-0 space-y-3">
                    <div className="flex items-center gap-4 h-10">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse flex-1" />
                    </div>
                    <div className="h-7 w-64 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Content skeleton */}
                <div className="space-y-6 pt-6">
                    <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
                    <div className="space-y-4">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-500/20 to-red-500/20 animate-pulse" />
        </div>
    );
}
