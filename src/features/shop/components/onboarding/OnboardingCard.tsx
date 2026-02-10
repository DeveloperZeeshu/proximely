'use client'

import Input from "@/components/ui/Input"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { handleAxiosError } from "@/apis/utils/handleAxiosError"
import { CreateShopInput, createShopSchema } from "../../schemas/create.schema"
import { Button } from "@/components/ui/button"
import { createShop } from "@/apis/shop.api"
import { useAppDispatch } from "@/hooks/redux-hooks"
import { editShop } from "@/store/shop/shopSlice"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { setShopStatus } from "@/store/auth/authSlice"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SHOP_CATEGORIES } from "@/lib/constants"

export function OnboardingCard() {
    const {
        handleSubmit,
        register,
        control
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

                <div
                    className="flex flex-col">
                    <label className="text-sm">Category</label>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                key={field.value}
                                onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="z-70">
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        {
                                            SHOP_CATEGORIES.map(c => (
                                                <SelectItem
                                                    key={c.value}
                                                    value={c.value}>
                                                    {c.label}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <Button
                    type="submit"
                    className="mt-3"
                    text="Submit"
                />
            </div>

        </form>
    )
}
