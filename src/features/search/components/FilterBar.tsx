'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function FilterBar() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const sort = searchParams.get('sort') || 'distance'
    const radius = searchParams.get('radius') || '10000'

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, value)
        params.delete('cursor')
        router.replace(`${pathname}?${params}`)
    }

    const handleSort = (value: string) => {
        updateParam('sort', value)
    }

    const handleFilters = (value: string) => {
        updateParam('radius', value)
    }

    return (
        <div className="flex flex-wrap items-center gap-3 mb-4">

            {/* SORT */}
            <Select
                value={sort}
                onValueChange={handleSort}
            >
                <SelectTrigger className=" bg-white border-gray-300">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                    <SelectGroup>
                        <SelectLabel>Sort by</SelectLabel>
                        <SelectItem value='distance'>Distance</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>


            {/* RADIUS FILTER */}
            <Select
            value={radius}
            onValueChange={handleFilters}
            >
                <SelectTrigger className=" bg-white border-gray-300">
                    <SelectValue placeholder="Filters" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                    <SelectGroup>
                        <SelectLabel>Radius</SelectLabel>
                        <SelectItem value="3000">Within 3 km</SelectItem>
                        <SelectItem value="5000">Within 5 km</SelectItem>
                        <SelectItem value="10000">Within 10 km</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
