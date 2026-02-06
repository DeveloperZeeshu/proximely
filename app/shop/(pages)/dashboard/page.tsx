'use client'

import { Plus } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Container from "@/components/container/Container";
import Link from "next/link";
import { ShopInfoCard } from "@/features/shop/components/ShopInfoCard";
import { StatCard } from "@/features/products/components/StatCard";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/store/products/useProducts";
import { useShop } from "@/store/shop/useShop";
import { AccountGate } from "../../AccountGate";

export default function ShopDashboard() {

    const { openProductForm } = useAppContext()

    const { shop } = useShop()
    const { products } = useProducts()

    return (
        <Container>
            <AccountGate>
                <div className="min-h-screen">

                    {/* HEADER */}
                    <div className="flex flex-col justify-between mb-10">
                        <h1 className="text-2xl font-semibold text-slate-800">
                            Shop Dashboard
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Control your store in real time
                        </p>
                    </div>

                    {/* STAT CARDS */}
                    {
                        <StatCard
                            totalProducts={products.length}
                            totalInStock={products.reduce((acc, p) => acc += p.isAvailable ? 1 : 0, 0)}
                            totalOutofStock={products.reduce((acc, p) => acc += !p.isAvailable ? 1 : 0, 0)}
                        />
                    }


                    {/* QUICK ACTIONS */}
                    <div className="flex flex-wrap gap-4 text-sm mb-10">
                        <button
                            onClick={openProductForm}
                            className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium active:scale-95 transition flex justify-center items-center gap-1">
                            <Plus size={18} />
                            <span>Add Product</span>
                        </button>

                        <Link
                            href='/shop/manage-products'
                            className="px-3 py-2 rounded-lg bg-white backdrop-blur active:scale-95 transition border border-gray-300 hover:bg-gray-50">
                            View All Products
                        </Link>

                        <Link
                            href='/shop/shop-profile'
                            className="px-3 py-2 rounded-lg bg-white backdrop-blur active:scale-95 transition border border-gray-300 hover:bg-gray-50">
                            Shop Profile
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-5">
                        {/* SHOP INFO */}
                        <ShopInfoCard
                            shop={shop}
                        />
                    </div>

                    {/* BOTTOM PANELS */}
                    <div className="grid md:grid-cols-2 gap-3 lg:gap-5 mt-3 lg:mt-5">

                        <Card>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>
                                No recent orders yet.
                            </CardDescription>
                        </Card>

                        <Card>
                            <CardTitle>Quick Actions</CardTitle>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <button className="py-2.5 rounded-lg active:scale-95 transition border-2 border-blue-500 text-blue-600 hover:bg-gray-50">
                                    Update Hours
                                </button>

                                <button className=" py-2.5 rounded-lg active:scale-95 transition border border-gray-300 hover:bg-gray-50">
                                    Go to Settings
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </AccountGate>
        </Container>
    );
};
