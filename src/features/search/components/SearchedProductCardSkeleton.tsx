
const SearchedProductCardSkeleton = () => {
    return (
        <div className="w-full max-w-xs animate-pulse rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Image skeleton */}
            <div className="aspect-4/3 rounded-t-2xl bg-gray-200" />

            <div className="p-4 space-y-4">
                {/* Category + Distance */}
                <div className="flex items-center justify-between">
                    <div className="h-5 w-20 rounded-full bg-gray-200" />
                    <div className="h-4 w-16 rounded bg-gray-200" />
                </div>

                {/* Product name */}
                <div className="h-5 w-3/4 rounded bg-gray-200" />

                {/* Description lines */}
                <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-5/6 rounded bg-gray-200" />
                </div>

                {/* Price */}
                <div className="h-6 w-24 rounded bg-gray-200" />

                {/* Divider */}
                <div className="h-px w-full bg-gray-100" />

                {/* Shop info */}
                <div className="space-y-2">
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                    <div className="h-4 w-4/5 rounded bg-gray-200" />
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <div className="h-10 w-full rounded-lg bg-gray-200" />
                    <div className="h-10 w-full rounded-lg bg-gray-200" />
                </div>
            </div>
        </div>

    )
}

export default SearchedProductCardSkeleton
