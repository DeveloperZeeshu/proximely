import { updateProduct } from "@/apis/inventory.api"
import { useState } from "react"
import toast from "react-hot-toast"
import { useAppDispatch } from "../redux-hooks"
import { deleteProduct } from "@/store/inventory/inventorySlice"
import { handleAxiosError } from "@/apis/utils/handleAxiosError"
import { useAppContext } from "@/context/AppContext"

export const useDeleteProduct = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const {closeProductForm} = useAppContext()

    const mutate = async (id: string | undefined) => {
        setLoading(true)

        if (!id) {
            toast.error('Something went wrong')
            setLoading(false)
            return
        }

        try {
            await updateProduct({
                productId: id,
                payload: { isDeleted: true }
            })

            toast.success('Product deleted successfully')
            dispatch(deleteProduct(id))
            closeProductForm()

        } catch (err: unknown) {
            handleAxiosError(err)
        } finally {
            setLoading(false)
        }
    }

    return { mutate, loading };
}

