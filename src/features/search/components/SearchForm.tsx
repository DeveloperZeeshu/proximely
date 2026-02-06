'use client'

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SearchProductInput, searchProductsSchema } from "../../products/schemas/search.schema";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { Search } from "lucide-react";

export const SearchForm = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const {
        register,
        watch,
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
                sort: 'distance',
                dir: 'next'
            })

            router.push(`/search-page?${params.toString()}`)
        } catch (err: unknown) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div
                className="
      flex items-center
      bg-white
      border border-slate-200
      rounded-full
      h-12
      pl-4 pr-0.5
      shadow-sm
      focus-within:ring-2 focus-within:ring-blue-500/20
      focus-within:border-blue-500
      transition
    "
            >
                {/* Icon */}
                <Search className="h-5 w-5 text-slate-400 shrink-0" />

                {/* Input */}
                <input
                    type="text"
                    placeholder="Search milk, soap, rice..."
                    autoFocus
                    enterKeyHint="search"
                    className="
        flex-1
        h-full
        bg-transparent
        text-sm sm:text-base
        placeholder:text-slate-400
        outline-none
        px-3
      "
                    {...register("name", { required: true })}
                />

                {/* Button */}
                <button
                    type="submit"
                    disabled={!watch("name")}
                    className="
        h-9
        px-4
        mr-1
        flex items-center justify-center
        text-sm font-medium
        rounded-full
        bg-blue-500 text-white
        hover:bg-blue-600
        disabled:bg-blue-300 disabled:cursor-not-allowed
        transition
      "
                >
                    Search
                </button>
            </div>
        </form>
    )
}

