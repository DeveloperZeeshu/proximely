import { Card, CardContent, CardDescription } from "@/components/ui/card";

interface StatCardPropType {
    totalProducts: number
    totalInStock: number
    totalOutofStock: number
    loading: boolean
}

export const StatCard = ({
    totalProducts,
    totalInStock,
    totalOutofStock,
    loading
}: StatCardPropType) => {
    const stats = [
        { label: "Products", value: totalProducts },
        { label: "In Stock", value: totalInStock },
        { label: "Out of Stock", value: totalOutofStock },
        { label: "Orders", value: 0 },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-10">
            {stats.map((item, i) => (
                <Card
                    key={i}
                    className="hover:shadow-lg hover:-translate-y-0.5">
                    <CardDescription>{item.label}</CardDescription>
                    {loading ?
                        <div className="animate-pulse h-8 w-15 bg-gray-200 rounded-full" /> :
                        <p className="text-3xl text-blue-500 font-bold">
                            {item.value}
                        </p>
                    }
                </Card>
            ))}
        </div>
    )
}

