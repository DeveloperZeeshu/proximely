'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Container from '@/components/container/Container'
import {
    Pagination,
    PaginationEllipsis,
    PaginationNext,
    PaginationPageNumber,
    PaginationPrevious
} from '@/components/ui/pagination'

import { ProductCard } from '@/features/search/components/ProductCard'
import { SearchForm } from '@/features/search/components/SearchForm'
import SearchPageSkeleton from '@/features/search/components/SearchPageSkeleton'
import { FilterBar } from '@/features/search/components/FilterBar'

import { useProductDiscovery } from '@/store/productDiscovery/useProductDiscovery'
import { itemsDiscovery } from '@/store/productDiscovery/productDiscoveryThunk'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { setQuery, SortType } from '@/store/productDiscovery/productDiscoverySlice'

export default function SearchPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()

    const {
        productDiscoveryLoading,
        productDiscoveryItems,
        productDiscoveryPrevCursor,
        productDiscoveryNextCursor,
        productDiscoveryHasNext,
        productDiscoveryHasPrev
    } = useProductDiscovery()


    /* ---------------- Pagination ---------------- */

    const updateCursor = (cursor: string, dir: 'next' | 'prev') => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('cursor', cursor)
        params.set('dir', dir)
        router.replace(`${pathname}?${params}`)
    }

    const handlePrevious = () => {
        if (!productDiscoveryHasPrev || !productDiscoveryPrevCursor) return
        updateCursor(productDiscoveryPrevCursor, 'prev')
    }

    const handleNext = () => {
        if (!productDiscoveryHasNext || !productDiscoveryNextCursor) return
        updateCursor(productDiscoveryNextCursor, 'next')
    }

    /* ---------------- Fetch Logic ---------------- */

    useEffect(() => {
        const name = searchParams.get('name') ?? ''
        const radius = Number(searchParams.get('radius') ?? 10000)
        const rawSort = searchParams.get('sort')
        const lat = Number(searchParams.get('lat'))
        const lng = Number(searchParams.get('lng'))
        const cursor = searchParams.get('cursor')
        const dir = searchParams.get('dir') as 'next' | 'prev' | null
        const limit = Number(searchParams.get('limit') ?? 10)

        const sort: SortType =
            rawSort === 'distance' ||
                rawSort === 'price_asc' ||
                rawSort === 'price_desc'
                ? rawSort
                : 'distance'

        dispatch(setQuery({
            query: {
                search: name,
                radius,
                sort,
                location: {
                    latitude: lat,
                    longitude: lng
                }
            },
            pagination: {
                limit,
                dir: cursor ? dir : null,
                activeCursor: cursor,
                cursor: {
                    prev: null,
                    next: null
                }
            }
        }))

        dispatch(itemsDiscovery())
    }, [searchParams, dispatch])

    /* ---------------- States ---------------- */

    if (productDiscoveryLoading) {
        return (
            <Container>
                <BackButton />
                <SearchPageSkeleton />
            </Container>
        )
    }

    if (!productDiscoveryLoading && productDiscoveryItems.length === 0) {
        return (
            <Container>
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 max-w-xl mx-auto w-full">
                        <SearchForm />
                    </div>
                    <Image
                        src="/noProductFound.svg"
                        alt="No products found"
                        width={300}
                        height={300}
                        className='w-50 h-auto'
                        priority
                    />
                    <p className="text-xl font-semibold mt-4 mb-6 text-center">
                        No products found nearby
                    </p>
                </div>
            </Container>
        )
    }


    return (
        <Container>
            <div className='flex flex-col justify-between min-h-screen'>
                {/* Back Button */}
                <div className=''>
                    <div className="mb-4">
                        <BackButton />
                    </div>

                    {/* SEARCH */}
                    <div className="mb-4 max-w-xl mx-auto w-full">
                        <SearchForm />
                    </div>

                    {/* FILTERS */}
                    <div className="mb-6">
                        <FilterBar />
                    </div>

                    {/* RESULTS GRID */}
                    <section>
                        {productDiscoveryItems.length > 0 ? (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {productDiscoveryItems.map((p) => (
                                    <li key={p.product._id} className="flex justify-center">
                                        <ProductCard
                                            productInfo={p.product}
                                            shopInfo={p.shop}
                                            distance={p.distanceKm}
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 mt-12">
                                No products found nearby.
                            </p>
                        )}
                    </section>
                </div>

                {/* PAGINATION */}
                <div className="mt-8 flex justify-center items-center gap-2">
                    <Pagination>
                        <PaginationPrevious
                            onClick={handlePrevious}
                            disabled={!productDiscoveryHasPrev}
                        />
                        <PaginationPageNumber page={1} />
                        {productDiscoveryHasNext && <PaginationEllipsis />}
                        <PaginationNext
                            onClick={handleNext}
                            disabled={!productDiscoveryHasNext}
                        />
                    </Pagination>
                </div>
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
