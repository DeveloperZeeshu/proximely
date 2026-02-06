'use client'

import Container from "@/src/components/container/Container";
import { AddressCard } from "@/src/features/shop/components/manage-profile/AddressCard";
import { BasicInfoCard } from "@/src/features/shop/components/manage-profile/BasicInfoCard";
import { LocationCard } from "@/src/features/shop/components/manage-profile/LocationCard";
import { ShopAppearance } from "@/src/features/shop/components/manage-profile/ShopAppearance";
import { ShopPreview } from "@/src/features/shop/components/manage-profile/ShopPreview";
import { useAuth } from "@/src/store/auth/useAuth";
import { useShop } from "@/src/store/shop/useShop";
import { AccountGate } from "../../AccountGate";

export default function ShopProfilePage() {
    const { shop } = useShop()
    const { authLoading, hasShop } = useAuth()

    const previewAddress =
        shop?.address ?
            `${shop?.address}, ${shop?.city}, ${shop?.state}, ${shop?.zipcode}` :
            'The seller hasn’t shared their shop address yet.'

    const coordinates = shop?.location?.coordinates
    let lat, lng
    if (coordinates) {
        lat = coordinates[1]
        lng = coordinates[0]
    }

    return (
        <Container>
            <AccountGate>
                <div className="flex flex-col justify-between mb-10">
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Shop Profile Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage how your shop appears to customers and update your business details.
                    </p>
                </div>
                <div className="flex w-full flex-col lg:flex-row gap-3 lg:gap-5">
                    {/* Preview */}
                    <div className="">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Customer Preview</h3>
                            <span
                                className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs"
                            >Live on site</span>
                        </div>
                        <ShopPreview
                            name={shop?.shopName}
                            address={previewAddress}
                            category={shop?.category}
                        />
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-3 lg:gap-5 w-full">
                        <ShopAppearance
                        />
                        <BasicInfoCard
                            shopId={shop?._id}
                            basicInfo={{
                                shopName: shop?.shopName,
                                phone: shop?.phone,
                                ownerName: shop?.ownerName,
                                category: shop?.category
                            }}
                        />
                        <AddressCard
                            shopId={shop?._id}
                            shopAddress={{
                                address: shop?.address,
                                city: shop?.city,
                                state: shop?.state,
                                zipcode: shop?.zipcode
                            }}
                        />
                        <LocationCard
                            initialLocation={{
                                lat,
                                lng
                            }}
                            shopId={shop?._id}
                        />
                    </div>
                </div>
            </AccountGate>
        </Container>
    )
}














