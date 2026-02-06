import { Card, CardTitle } from "@/components/ui/card"
import { ShopInfoType } from "@/types/shop.types"

export const ShopInfoCard = ({ shop }: { shop: ShopInfoType | null }) => {
    return (
        <Card>
            <CardTitle>Shop Info</CardTitle>

            <div className="space-y-3 text-sm text-slate-600">
                <p>Owner: <span className="font-semibold">{shop?.ownerName}</span></p>
                <p>Shop: <span className="font-semibold">{shop?.shopName}</span></p>
                <p>Phone: <span className="font-semibold">+91 {shop?.phone}</span></p>
                <p>Address: <span className="font-semibold">{shop?.address}</span></p>
                <p>Status: <span className="text-green-600 font-semibold">Active</span></p>
            </div>
        </Card>
    )
}
