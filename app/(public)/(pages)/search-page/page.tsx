'use client'

import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from "next/navigation"
import Container from "@/src/components/container/Container"
import { ProductCard, SearchedProductType } from "@/src/features/search/components/ProductCard"
import { searchProduct } from "@/src/apis/product.api"
import Image from "next/image"
import SearchPageSkeleton from "@/src/features/search/components/SearchPageSkeleton"
import { Button } from "@/src/components/ui/button"


export default function SearchPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [products, setProducts] = useState<SearchedProductType[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const fetchProducts = useCallback(async () => {
        const name = String(searchParams.get('name'));
        const radius = Number(searchParams.get('radius') || 10000);
        const lat = Number(searchParams.get('lat'));
        const lng = Number(searchParams.get('lng'));

        if (!lat || !lng) {
            toast.error('Location data missing');
            setLoading(false);
            return;
        }

        try {
            const result = await searchProduct({
                query: {
                    name,
                    radius,
                },
                coordinates: {
                    latitude: lat,
                    longitude: lng
                }
            })
            setProducts(result.products)
        } catch (err) {
            // console.error(err);
            toast.error('Error fetching products');
        } finally {
            setLoading(false);
        }
    }, [searchParams])

    useEffect(() => {
        setLoading(true)
        fetchProducts();
    }, [fetchProducts]);

    if (loading)
        return (
            <Container>
                <div className='w-full'>
                    <button
                        onClick={() => router.push('/')}
                        className='text-sm mb-2 text-blue-500 hover:text-blue-600 flex gap-.5 items-center cursor-pointer'
                    ><ArrowLeft size={18} />
                        Back to Home
                    </button>
                </div>
                <SearchPageSkeleton />
            </Container>
        )

    if (products.length < 1)
        return (
            <Container>
                <div
                    className='flex flex-col items-center min-h-screen'>
                    <Image
                        src='/noProductFound.svg'
                        alt='no product found nearby'
                        loading="eager"
                        height={300}
                        width={300}
                        
                    />
                    <p className='text-xl font-semibold mb-5 text-center'>No Product found nearby.</p>
                    <Button
                        type='button'
                        text='Go Back'
                        onClick={() => router.push('/')}
                    />
                </div>
            </Container>
        )

    return (
        <>
            <Container>
                <div className='w-full'>
                    <button
                        onClick={() => router.push('/')}
                        className='text-sm mb-2 text-blue-500 hover:text-blue-600 flex gap-.5 items-center cursor-pointer'
                    ><ArrowLeft size={18} />
                        Back to Home
                    </button>
                </div>
                <div className='min-h-screen'>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl text-slate-800 font-bold">Find What You Need, Nearby.</h2>
                        <p className="text-gray-500 text-sm mt-1">Showing products available near your location.</p>
                    </div>

                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 place-items-center mt-4">
                        {
                            products && products.map((p) => (
                                <ProductCard
                                    key={p.product._id}
                                    productInfo={p.product}
                                    shopInfo={p.shop}
                                    distance={p.distanceKm}
                                />
                            ))}
                    </ul>
                </div>
            </Container>
        </>
    )
}


