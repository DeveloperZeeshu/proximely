'use client'

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SearchProductInput, searchProductsSchema } from "../../products/schemas/search.schema";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCurrentLocation } from "@/src/utils/getCurrentLocation";
import { Search } from "lucide-react";

export const SearchForm = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const {
        register,
        handleSubmit
    } = useForm({
        resolver: zodResolver(searchProductsSchema)
    });
    const router = useRouter()

    const onSubmit: SubmitHandler<SearchProductInput> = async (data) => {
        setLoading(true)
        try {
            const { lat, lng } = await getCurrentLocation()
            if (!lat || !lng) return

            const params = new URLSearchParams({
                name: data.name,
                radius: String(data.radius),
                lat: String(lat),
                lng: String(lng),
            })

            router.push(`/search-page?${params.toString()}`)
        } catch (err: unknown) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col lg:flex-row gap-3 lg:gap-4 w-full items-center">

            <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search milk, soap, rice..."
                    className="w-full h-10 pl-11 rounded-lg bg-white border border-gray-300 focus:ring-3 focus:ring-blue-500/20
              focus:border-blue-500 transition outline-none"
                    {...register("name")}
                />
            </div>

            <select
                {...register("radius", { valueAsNumber: true })}
                className="text-sm border border-gray-300 rounded-md
    px-3 h-10 focus:ring-3 focus:ring-blue-500/20
    focus:border-blue-500 transition outline-none bg-white"
            >
                <option value={5000}>Within 5 km</option>
                <option value={10000}>Within 10 km</option>
                <option value={25000}>Within 25 km</option>
            </select>


            <button
                className="px-3.5 h-10 justify-center flex items-center text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition w-full lg:w-auto">
                Search
            </button>
        </form>
    )
}

