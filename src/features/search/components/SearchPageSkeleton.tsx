import SearchedProductCardSkeleton from "@/features/search/components/SearchedProductCardSkeleton";

export default function SearchPageSkeleton() {
    return (
        <div className="min-h-screen animate-pulse">

            {/* Header Skeleton */}
            <div className="text-center mb-6">
                <div className="h-8 w-64 bg-slate-300 rounded mx-auto mb-2"></div>
                <div className="h-4 w-70 lg:w-80 bg-slate-300/70 rounded mx-auto"></div>
            </div>

            {/* Product Grid Skeleton */}
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 place-items-center mt-4">
                {Array(3).fill(null).map((_, i) => (
                    <li
                        key={i}
                        className="w-full flex justify-center">
                        <SearchedProductCardSkeleton />
                    </li>
                ))}
            </ul>
        </div>
    );
};

