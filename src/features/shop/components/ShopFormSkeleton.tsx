import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const ShopFormSkeleton = () => {
    const router = useRouter()
    return (
        <div className="min-h-screen flex flex-col items-center">
            <div className='w-full md:w-xl lg:w-4xl pl-3 lg:pl-0'>
                <button
                    onClick={() => router.push('/shop/dashboard')}
                    className='text-sm mb-2 text-blue-600 font-semibold hover:text-blue-500 flex gap-.5 items-center cursor-pointer'
                ><ArrowLeft size={18} />
                    Back to Home
                </button>
            </div>
            <div className="animate-pulse shadow-sm flex flex-col items-center justify-center bg-white rounded-xl p-5 py-10 w-full max-w-xl lg:max-w-4xl md:w-xl lg:w-4xl">
                <div className="pb-15 flex flex-col items-center">
                    <div className="h-9 w-50 bg-gray-200 rounded-full mb-3" />
                    <div className="h-5 w-50 md:w-70 lg:w-70 bg-gray-200 rounded-full" />
                </div>
                <div className="flex flex-col gap-7 w-full">
                    {
                        Array(3).fill(null).map((_, idx) => (
                            <div
                                key={idx}
                                className="w-full flex flex-col lg:flex-row gap-5">
                                <div className="w-full">
                                    <div className="h-5 w-20 bg-gray-200 rounded-full mb-2" />
                                    <div className="h-11 w-full bg-gray-200 rounded-lg" />
                                </div>
                                <div className="w-full">
                                    <div className="h-5 w-20 bg-gray-200 rounded-full mb-2" />
                                    <div className="h-11 w-full bg-gray-200 rounded-lg" />
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="h-11 w-full bg-gray-200 rounded-lg mt-8" />
                <div className="h-4 w-60 lg:w-90 bg-gray-200 rounded-full mt-8" />
            </div>
        </div>
    )
}

export default ShopFormSkeleton

