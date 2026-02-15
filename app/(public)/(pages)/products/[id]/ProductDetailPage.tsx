'use client'

import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    MapPin,
    Phone,
    MessageCircle,
    Share2,
    Navigation
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { handleAxiosError } from '@/apis/utils/handleAxiosError';
import { productInDetail } from '@/apis/productDiscovery.api';
import { useRouter } from 'next/navigation';

type ProductInfo = {
    product: {
        _id: string
        name: string
        price: number
        description: string
        category: string
        imageUrl: string
    },

    shop: {
        _id: string
        shopName: string
        address: string
        phone: string
        coordinates: [number, number]
    }
}

export default function ProductDetailPage({ productId }: { productId: string }) {
    const [itemInfo, setItemInfo] = useState<ProductInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter()

    useEffect(() => {
        const getProductDetails = async () => {
            try {
                setIsLoading(true);
                const res = await productInDetail(productId);
                setItemInfo(res);
            } catch (err) {
                handleAxiosError(err);
            } finally {
                setIsLoading(false);
            }
        };
        if (productId) getProductDetails();
    }, [productId]);

    if (isLoading) return <ProductDetailSkeleton />;

    if (!itemInfo) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-slate-500">Product not found</p>
            <Link href="/" className="mt-4 text-blue-600 font-bold">Back to Search</Link>
        </div>
    );

    const { shop, product } = itemInfo;

    const shopName = shop?.shopName || "Unknown Shop";
    const address = shop?.address || "Address not available";
    const phone = shop?.phone || "";
    const coordinates = shop?.coordinates || [0, 0];

    const name = product?.name || "Product Name";
    const price = product?.price || 0;
    const description = product?.description || "No description provided.";
    const imageUrl = product?.imageUrl || "";
    const category = product?.category || "General";

    const googleMapsUrl = `https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`;

    return (
        <div className="min-h-screen bg-white pt-18 pb-24 lg:pb-10">
            {/* MOBILE NAV */}
            <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 px-4 py-4 backdrop-blur-md lg:hidden">
                <button
                onClick={() => router.back()}
                 className="rounded-full bg-slate-100 p-2 text-slate-900">
                    <ArrowLeft size={20} />
                </button>
                <button className="rounded-full bg-slate-100 p-2 text-slate-900">
                    <Share2 size={20} />
                </button>
            </header>

            <main className="mx-auto max-w-7xl lg:px-8 lg:py-12 grid lg:grid-cols-2 lg:gap-x-12">

                {/* LEFT: IMAGE */}
                <div className="relative w-full aspect-square lg:rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
                    <Image
                        src={imageUrl || '/images/product-placeholder.jpg'}
                        alt={name}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                </div>

                {/* RIGHT: INFO */}
                <div className="flex flex-col px-4 pt-6 lg:px-0 lg:pt-0">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{category}</span>
                        <h1 className="mt-1 text-2xl lg:text-4xl font-bold text-slate-900 leading-tight">{name}</h1>
                    </div>

                    <div className="mt-4 flex gap-3 items-center">
                        <span className="text-2xl lg:text-3xl font-black text-slate-900">
                            ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            Available Nearby
                        </span>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Product Details</h3>
                        <p className="mt-3 leading-relaxed text-slate-600 text-[15px]">{description}</p>
                    </div>

                    {/* SHOP CARD */}
                    <div className="mt-10 rounded-3xl border border-slate-100 bg-slate-50/50 p-3 lg:p-5 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-100">
                                {shopName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 truncate">{shopName}</h4>
                                <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                    <MapPin size={14} className="text-blue-500" /> {address}
                                </p>
                            </div>
                        </div>
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 py-2 lg:py-3 text-sm font-bold text-slate-900 hover:shadow-md transition-all active:scale-[0.98]"
                        >
                            <Navigation size={18} /> Get Directions
                        </a>
                    </div>

                    {/* DESKTOP ACTIONS */}
                    <div className="hidden lg:mt-10 lg:flex lg:gap-4">
                        <a href={`tel:${phone}`} className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 py-3 font-bold text-slate-900 hover:bg-slate-50 transition">
                            <Phone size={20} /> Call Shop
                        </a>
                        <button className="flex-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-xl shadow-blue-100 hover:bg-blue-700 transition">
                            <MessageCircle size={20} /> Message Seller
                        </button>
                    </div>
                </div>
            </main>

            {/* MOBILE STICKY FOOTER */}
            <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-100 bg-white/95 p-4 backdrop-blur-md lg:hidden z-50">
                <div className="mx-auto flex gap-3 max-w-md">
                    <a href={`tel:${phone}`} className="flex aspect-square items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-slate-900 shadow-sm">
                        <Phone size={24} />
                    </a>
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-200 py-3">
                        <MessageCircle size={20} /> Message Seller
                    </button>
                </div>
            </footer>
        </div>
    );
}


const ProductDetailSkeleton = () => (
    <div className="animate-pulse mx-auto max-w-7xl pt-30 pb-24 lg:pb-10 grid lg:grid-cols-2 lg:gap-x-12">
        <div className="aspect-square w-full bg-slate-200 lg:rounded-2xl" />
        <div className="flex flex-col px-4 pt-6 lg:pt-0 space-y-4 lg:py-12">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-8 w-3/4 bg-slate-200 rounded" />
            <div className="h-6 w-1/4 bg-slate-200 rounded" />
            <div className="h-32 w-full bg-slate-100 rounded-2xl mt-8" />
            <div className="h-40 w-full bg-slate-50 rounded-2xl mt-10" />
        </div>
    </div>
);