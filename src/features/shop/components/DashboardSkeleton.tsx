const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse rounded-3xl bg-slate-200 ${className}`} />
);

const DashboardSkeleton = () => {
    return (
        <div className="min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <div className="space-y-3">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-11 w-11 rounded-full" />
            </div>

            {/* STAT CARDS */}
            <StatCardSkeleton />

            {/* QUICK ACTIONS */}
            <div className="flex flex-wrap gap-4 mb-10">
                <Skeleton className="h-11 w-36 rounded-2xl bg-white" />
                <Skeleton className="h-11 w-40 rounded-2xl bg-white" />
                <Skeleton className="h-11 w-40 rounded-2xl bg-white" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-5">

                {/* SHOP INFO */}
                <div className="p-3 lg:p-5 rounded-lg bg-white space-y-4">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-4 w-36" />
                </div>

                {/* PRODUCTS */}
                <DashboardProductsSkeleton />
            </div>

            {/* BOTTOM PANELS */}
            <div className="grid md:grid-cols-2 gap-3 lg:gap-5 mt-3 lg:mt-5">

                <div className="p-3 lg:p-5 rounded-lg bg-white space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-64" />
                </div>

                <div className="p-3 lg:p-5 rounded-lg bg-white space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-11 rounded-lg" />
                        <Skeleton className="h-11 rounded-lg" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardSkeleton;


export const DashboardProductsSkeleton = () => {
    return (
        <div className="lg:col-span-2 p-3 lg:p-5 rounded-lg bg-white">

            {/* TOP BAR */}
            <div className="flex gap-2 justify-between items-center mb-6">
                <Skeleton className="h-5 w-25 lg:w-32" />
                <Skeleton className="h-10 w-60 rounded-lg" />
            </div>

            {/* PRODUCT LIST */}
            <div className="space-y-2 lg:space-y-5">
                {Array(4).fill(null).map((_, i) => (
                    <div
                        key={i}
                        className="flex justify-between p-3 lg:p-5 rounded-lg bg-slate-100"
                    >
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-25 lg:w-38" />
                            <Skeleton className="h-3 w-20 lg:w-28" />
                        </div>

                        <div className="flex gap-3 items-center">
                            <Skeleton className="h-7 w-18 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const StatCardSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="p-3 lg:p-5 rounded-lg bg-white"
                >
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-8 w-24" />
                </div>
            ))}
        </div>
    )
}

