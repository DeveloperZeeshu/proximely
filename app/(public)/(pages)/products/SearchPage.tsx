'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import Container from '@/components/container/Container'

import { ProductCard } from '@/features/search/components/ProductCard'
import { SearchForm } from '@/features/search/components/SearchForm'
import SearchPageSkeleton from '@/features/search/components/SearchPageSkeleton'
import { FilterBar } from '@/features/search/components/FilterBar'

import { useProductDiscovery } from '@/store/productDiscovery/useProductDiscovery'
import { itemsDiscovery } from '@/store/productDiscovery/productDiscoveryThunk'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { setQuery, SortType } from '@/store/productDiscovery/productDiscoverySlice'
import { cn } from 'lib/utils'

export default function SearchPage() {
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()

    const {
        productDiscoveryLoading,
        productDiscoveryItems,
        productDiscoveryHasMore
    } = useProductDiscovery()

    const isInitialLoading = productDiscoveryLoading && productDiscoveryItems.length === 0
    const isFetchingMore = productDiscoveryLoading && productDiscoveryItems.length > 0

    useEffect(() => {
        const name = searchParams.get('name') ?? ''
        const radius = Number(searchParams.get('radius') ?? 10000)
        const rawSort = searchParams.get('sort')
        const lat = Number(searchParams.get('lat'))
        const lng = Number(searchParams.get('lng'))

        const sort: SortType = (['distance', 'price_asc', 'price_desc'] as string[]).includes(rawSort ?? '')
            ? (rawSort as SortType)
            : 'distance'

        dispatch(setQuery({
            query: {
                search: name,
                radius,
                sort,
                location: { latitude: lat, longitude: lng }
            },
            pagination: {
                limit: 12,
                nextCursor: null,
                hasMore: false
            }
        }))

        dispatch(itemsDiscovery())
    }, [searchParams, dispatch])

    const handleLoadMore = () => {
        if (!productDiscoveryHasMore || productDiscoveryLoading) return
        dispatch(itemsDiscovery())
    }

    if (isInitialLoading) {
        return (
            <Container>
                <BackButton />
                <div className="mt-4 max-w-xl mx-auto"><SearchForm /></div>
                <div className="mt-6"><SearchPageSkeleton /></div>
            </Container>
        )
    }

    return (
        <Container>
            <div className="flex flex-col min-h-[80vh]">

                {/* Header Section */}
                <header className="space-y-4 mb-6">
                    <BackButton />
                    <div className="max-w-xl mx-auto w-full">
                        <SearchForm />
                    </div>
                    <FilterBar />
                </header>

                {/* Content Section */}
                <main className="grow">
                    {productDiscoveryItems.length > 0 ? (
                        <div className="space-y-8">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {productDiscoveryItems.map((p) => (
                                    <ProductCard
                                        key={p.product._id}
                                        productInfo={p.product}
                                        shopInfo={p.shop}
                                        distance={p.distanceKm}
                                    />
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Image
                                src="/noProductFound.svg"
                                alt="No products found"
                                width={240}
                                height={240}
                                className="opacity-80"
                            />
                            <h3 className="text-xl font-bold mt-6 text-gray-900">No products nearby</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your filters or search area.</p>
                        </div>
                    )}
                </main>

                {/* Footer / Pagination Section */}
                {productDiscoveryItems.length > 0 && (
                    <footer className="mt-12 mb-8 flex flex-col items-center border-t pt-8 text-sm">
                        {isFetchingMore ? (
                            <div className="flex items-center space-x-2 text-blue-600 font-medium">
                                <div className="h-4 w-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                                <span>Loading more products...</span>
                            </div>
                        ) : (
                            <button
                                disabled={!productDiscoveryHasMore}
                                onClick={handleLoadMore}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                                    productDiscoveryHasMore
                                        ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-95"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                                )}
                            >
                                {productDiscoveryHasMore ? 'Show More Results' : 'End of Results'}
                            </button>
                        )}
                    </footer>
                )}
            </div>
        </Container>
    )
}

/* ---------------- Back Button ---------------- */

function BackButton() {
    const router = useRouter()
    return (
        <div className="w-full">
            <button
                onClick={() => router.push('/')}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
                <ArrowLeft size={18} />
                Back to Home
            </button>
        </div>
    )
}
