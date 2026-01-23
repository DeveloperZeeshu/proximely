'use client'

import Select from "@/src/components/ui/Select"
import Input from "@/src/components/ui/Input"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { handleAxiosError } from "@/src/apis/utils/handleAxiosError"
import { CreateShopInput, createShopSchema } from "../../schemas/create.schema"
import { Button } from "@/src/components/ui/button"
import { createShop } from "@/src/apis/shop.api"
import { useAppDispatch } from "@/src/hooks/redux-hooks"
import { editShop } from "@/src/store/shop/shopSlice"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { setShopStatus } from "@/src/store/auth/authSlice"

export function OnboardingCard() {
    const {
        handleSubmit,
        register
    } = useForm<CreateShopInput>({
        resolver: zodResolver(createShopSchema)
    })

    const dispatch = useAppDispatch()
    const router = useRouter()

    const submit: SubmitHandler<CreateShopInput> = async (data) => {
        try {
            const result = await createShop(data)
            dispatch(editShop(result.createdShop))
            dispatch(setShopStatus(true))
            toast.success('Onboarding complete!')
            toast.success('You can finish setting up your profile in Shop Profile')
            router.push('shop-profile')
        } catch (err: unknown) {
            handleAxiosError(err)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="bg-white rounded-xl border border-gray-200 p-5"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Basic Information</h3>
            </div>

            <div className="flex flex-col gap-4">
                <Input
                    label="Shop Name"
                    placeholder="Shop Name"
                    {...register('shopName')}
                />

                <Input
                    label="Owner Name"
                    placeholder="Owner Name"
                    {...register('ownerName')}
                />

                <Input
                    label="Phone"
                    placeholder="Phone"
                    {...register('phone')}
                />

                <Select
                    label="Category"
                    options={['General Store']}
                    {...register('category')}
                />

                <Button
                    type="submit"
                    className="mt-3"
                    text="Submit"
                />
            </div>

        </form>
    )
}
