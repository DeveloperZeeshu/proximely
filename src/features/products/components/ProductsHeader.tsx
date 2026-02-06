import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { useAppContext } from "@/src/context/AppContext"
import { Filter, Search } from "lucide-react"

export const ProductsHeader = () => {
    const { openProductForm } = useAppContext()
    return (
        <div
            className="flex flex-col md:flex-row lg:flex-row items-center gap-3 w-full md:w-auto lg:w-auto mb-6">

            <div className="relative w-full flex-1">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full text-sm h-9.5 pl-10 pr-4 rounded-lg border border-gray-300 bg-white shadow focus:border-blue-400 focus:ring-3 focus:ring-blue-500/20 transition-[box-shadow,border-color] outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
                    <Search size={19} />
                </span>
            </div>

            <div className="flex gap-3 w-full md:w-auto lg:w-auto">
                <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-3 bg-white shadow w-full lg:w-auto justify-between"
                >
                    <span>Filter</span>
                    <Filter size={15} />
                </button>

                <div className="relative w-full lg:w-auto">
                    <Select>
                        <SelectTrigger className="bg-white border-gray-300 shadow w-full">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="z-70">
                            <SelectGroup>
                                <SelectLabel>Sort by</SelectLabel>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                                <SelectItem value="name_asc">Name (A–Z)</SelectItem>
                                <SelectItem value="name_desc">Name (Z–A)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button
                type="button"
                text="Add Product"
                className="h-9.5 w-full md:w-auto"
                onClick={openProductForm}
            />
        </div>
    )
}
