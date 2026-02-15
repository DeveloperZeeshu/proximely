import { logoutUser } from "@/apis/auth.api"
import { handleAxiosError } from "@/apis/utils/handleAxiosError"
import { useState } from "react"
import { useAppDispatch } from "../redux-hooks"
import { clearAuth } from "@/store/auth/authSlice"
import { clearProducts } from "@/store/inventory/inventorySlice"
import { clearShop } from "@/store/shop/shopSlice"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const useLogout = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const mutate = async () => {
        setLoading(true)
        try {
            await logoutUser()
            dispatch(clearAuth())
            dispatch(clearProducts())
            dispatch(clearShop())

            toast.success('Log Out Successfully')

            router.push('/auth/login')
        } catch (err: unknown) {
            handleAxiosError(err)
        } finally {
            setLoading(false)
        }
    }

    return { mutate, loading }
}
