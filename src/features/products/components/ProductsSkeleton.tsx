const ProductsSkeleton = () => {
    return (
        <div className="min-h-screen animate-pulse">
            {/* HEADER */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="h-8 w-56 bg-gray-200 rounded mb-3" />
                    <div className="h-4 w-64 lg:w-72 bg-gray-200 rounded" />
                </div>
            </div>

            {/* TOOLBAR */}
            <div className="flex flex-col md:flex-row items-center gap-3 w-full mb-6">
                {/* Search */}
                <div className="relative w-full flex-1">
                    <div className="h-9.5 w-full rounded-lg bg-gray-200" />
                </div>

                {/* Filter + Sort */}
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="h-9.5 w-full md:w-24 rounded-lg bg-gray-200" />
                    <div className="h-9.5 w-full md:w-32 rounded-lg bg-gray-200" />
                </div>

                {/* Add button */}
                <div className="h-9.5 w-full md:w-32 rounded-lg bg-gray-200" />
            </div>

            {/* DESKTOP TABLE */}
            <DesktopProductCardSkeleton />

            {/* MOBILE CARDS */}
            <div className="md:hidden space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <MobileProductCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}

export default ProductsSkeleton


export const DesktopProductCardSkeleton = () => {
    return (
        <table className="w-full text-sm hidden md:table">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                </tr>
            </thead>

            <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                    <tr
                        key={i}
                        className="border-b last:border-b-0 border-gray-200"
                    >
                        <td className="px-4 py-2">
                            <div className="h-12 w-12 rounded bg-gray-200" />
                        </td>

                        <td className="px-4 py-2">
                            <div className="flex flex-col gap-1 max-w-md">
                                <div className="h-4 w-48 rounded bg-gray-200" />
                                <div className="h-3 w-72 rounded bg-gray-100" />
                            </div>
                        </td>

                        <td className="px-4 py-2">
                            <div className="h-4 w-20 rounded bg-gray-200" />
                        </td>

                        <td className="px-4 py-2">
                            <div className="h-4 w-10 rounded bg-gray-200" />
                        </td>

                        <td className="px-4 py-2">
                            <div className="h-6 w-24 rounded-full bg-gray-200" />
                        </td>

                        <td className="px-4 py-2 text-right">
                            <div className="inline-flex gap-2">
                                <div className="h-8 w-8 rounded-md bg-gray-200" />
                                <div className="h-8 w-8 rounded-md bg-gray-200" />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}


export const MobileProductCardSkeleton = () => {
    return (
        <div className="bg-white flex items-center gap-3 border-b border-gray-200 px-3 py-2 rounded-lg">
            <div className="h-12 w-12 shrink-0 rounded bg-gray-200" />

            <div className="min-w-0 flex-1">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-1 h-3 w-full rounded bg-gray-100" />

                <div className="mt-2 flex items-center gap-2">
                    <div className="h-3 w-12 rounded bg-gray-200" />
                    <div className="h-3 w-2 rounded bg-gray-200" />
                    <div className="h-3 w-16 rounded bg-gray-200" />
                </div>
            </div>

            <div className="flex gap-1">
                <div className="h-8 w-8 rounded-md bg-gray-200" />
                <div className="h-8 w-8 rounded-md bg-gray-200" />
            </div>
        </div>
    )
}
