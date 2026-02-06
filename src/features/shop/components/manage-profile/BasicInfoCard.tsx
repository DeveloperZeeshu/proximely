'use client'

import { Actions } from "./Actions"
import Input from "@/components/ui/Input"
import { Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { handleAxiosError } from "@/apis/utils/handleAxiosError"
import { UpdateShopInput, updateShopSchema } from "../../schemas/update.schema"
import { updateShop } from "@/apis/shop.api"
import toast from "react-hot-toast"
import { useAppDispatch } from "@/hooks/redux-hooks"
import { editShop } from "@/store/shop/shopSlice"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

type BasicInfoType = {
  shopName?: string
  phone?: string
  ownerName?: string
  category?: string
}

type PropType = {
  basicInfo?: BasicInfoType
  shopId?: string
}

export function BasicInfoCard({ basicInfo = {}, shopId }: PropType) {
  const [toEdit, setToEdit] = useState(false)

  const dispatch = useAppDispatch()

  const {
    handleSubmit,
    register,
    reset,
    control
  } = useForm<UpdateShopInput>({
    resolver: zodResolver(updateShopSchema),
    defaultValues: {
      shopName: basicInfo.shopName,
      ownerName: basicInfo.ownerName,
      phone: basicInfo.phone,
      category: basicInfo.category
    }
  })

  useEffect(() => {
    reset({
      shopName: basicInfo.shopName,
      ownerName: basicInfo.ownerName,
      phone: basicInfo.phone,
      category: basicInfo.category
    })
  }, [basicInfo, reset])

  const submit: SubmitHandler<UpdateShopInput> = async (data) => {
    if (!shopId) return
    try {
      const result = await updateShop({
        shopId,
        payload: data
      })

      dispatch(editShop(result.updatedShop))

      toast.success('Profile updated successfully')

      setToEdit(false)
    } catch (err: unknown) {
      handleAxiosError(err)
    }
  }


  const cancelEdit = () => {
    reset()
    setToEdit(false)
  }

  const isBasicInfoComplete =
    !!basicInfo.category &&
    !!basicInfo.ownerName &&
    !!basicInfo.shopName &&
    !!basicInfo.phone

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-white rounded-xl shadow p-5"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Basic Information</h3>

        {!toEdit && (
          <div
            onClick={() => setToEdit(true)}
            className="text-sm flex items-center gap-1 cursor-pointer hover:text-gray-800"
          >
            <Pencil size={14} />
            <span>Edit</span>
          </div>
        )}
      </div>

      {!isBasicInfoComplete &&
        <p className="text-sm text-red-600 mb-3">
          Add your shop name, description, and category so customers can quickly understand what you sell and what makes your shop unique.
        </p>
      }

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Shop Name"
          placeholder="Shop Name"
          disabled={!toEdit}
          {...register('shopName')}
        />

        <Input
          label="Owner Name"
          placeholder="Owner Name"
          disabled={!toEdit}
          {...register('ownerName')}
        />

        <Input
          label="Phone"
          placeholder="Phone"
          disabled={!toEdit}
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
                onValueChange={field.onChange}
                disabled={!toEdit}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="z-70">
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="General Store">General Store</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {toEdit && (
        <Actions
          toggleEdit={cancelEdit}
        />
      )}
    </form>
  )
}
