
export const SearchedProductCardSkeleton = () => {
    return (
        <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* IMAGE SKELETON - Matches h-32 */}
            <div className="h-32 w-full bg-slate-200 animate-pulse" />

            {/* CONTENT SKELETON */}
            <div className="p-3 space-y-3">
                {/* Name Line */}
                <div className="h-4 w-3/4 bg-slate-200 rounded-md animate-pulse" />

                {/* Price & Distance Row */}
                <div className="flex justify-between items-center mt-1">
                    {/* Price Tag */}
                    <div className="h-5 w-16 bg-slate-200 rounded-md animate-pulse" />
                    {/* Distance Tag */}
                    <div className="h-3 w-10 bg-slate-100 rounded-md animate-pulse" />
                </div>

                {/* Shop Name Footer */}
                <div className="pt-2 border-t border-slate-50">
                    <div className="h-3 w-1/2 bg-slate-100 rounded-md animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default SearchedProductCardSkeleton
