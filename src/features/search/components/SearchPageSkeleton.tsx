import SearchedProductCardSkeleton from "@/features/search/components/SearchedProductCardSkeleton";

export default function SearchPageSkeleton() {
    return (
        <div className="min-h-screen animate-pulse">
            {/* Product Grid Skeleton */}

            <FilterSkeleton />

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 place-items-center mt-4">
                {Array(4).fill(null).map((_, i) => (
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

export const FilterSkeleton = () => {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-pulse">
            {/* SORT SELECT SKELETON */}
            <div className="h-10 w-32 bg-slate-200 rounded-md border border-slate-100" />

            {/* RADIUS SELECT SKELETON */}
            <div className="h-10 w-28 bg-slate-200 rounded-md border border-slate-100" />
        </div>
    );
};
