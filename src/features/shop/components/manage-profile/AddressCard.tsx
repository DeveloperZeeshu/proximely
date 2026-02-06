'use client'

import Input from "@/src/components/ui/Input"
import { Actions } from "./Actions"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { handleAxiosError } from "@/src/apis/utils/handleAxiosError"
import { UpdateShopInput, updateShopSchema } from "../../schemas/update.schema"
import { updateShop } from "@/src/apis/shop.api"
import toast from "react-hot-toast"
import { useAppDispatch } from "@/src/hooks/redux-hooks"
import { editShop } from "@/src/store/shop/shopSlice"

type ShopAddressType = {
  address?: string
  city?: string
  state?: string
  zipcode?: string
}

type PropType = {
  shopAddress?: ShopAddressType
  shopId?: string
}

export function AddressCard({ shopAddress = {}, shopId }: PropType) {
  const [toEdit, setToEdit] = useState(false)

  const dispatch = useAppDispatch()

  const {
    handleSubmit,
    reset,
    register,
    control
  } = useForm<UpdateShopInput>({
    resolver: zodResolver(updateShopSchema),
    defaultValues: {
      address: shopAddress.address,
      city: shopAddress.city,
      state: shopAddress.state,
      zipcode: shopAddress.zipcode
    }
  })

  useEffect(() => {
    reset({
      address: shopAddress.address,
      city: shopAddress.city,
      state: shopAddress.state,
      zipcode: shopAddress.zipcode
    })
  }, [shopAddress, reset])

  const isAddressComplete =
    !!shopAddress.address &&
    !!shopAddress.city &&
    !!shopAddress.state &&
    !!shopAddress.zipcode

  const submit: SubmitHandler<UpdateShopInput> = async (data) => {
    if (!shopId) return
    try {
      const result = await updateShop({
        shopId,
        payload: data
      })

      dispatch(editShop(result.updatedShop))

      toast.success('Address updated successfully')

      setToEdit(false)
    } catch (err: unknown) {
      handleAxiosError(err)
    }
  }


  const cancelEdit = () => {
    reset()
    setToEdit(false)
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-white rounded-xl shadow p-5"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Shop Address</h3>

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

      {!isAddressComplete &&
        <p className="text-red-600 text-sm mb-3">
          Your shop address is incomplete. Adding a full address helps customers find your shop and improves visibility in search results.
        </p>}

      <div className="flex flex-col gap-4">
        <Input
          label="Address"
          placeholder="Street Address"
          {...register('address')}
          disabled={!toEdit}
        />

        <div className="flex gap-3 lg:gap-4">
          <div className="flex flex-col w-full">
              <label className="text-sm">City</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    disabled={!toEdit}
                    onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="z-70">
                      <SelectGroup>
                        <SelectLabel>City</SelectLabel>
                        <SelectItem value="jaipur">Jaipur</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

          <div className="flex flex-col w-full">
              <label className="text-sm">State</label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    disabled={!toEdit}
                    onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="z-70">
                      <SelectGroup>
                        <SelectLabel>State</SelectLabel>
                        <SelectItem value="jaipur">Rajasthan</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

          {/* <Select
            label="State"
            options={['rajasthan']}
            {...register('state')}
            disabled={!toEdit}
          /> */}

          <Input
            label="Zip Code"
            placeholder="Zip Code"
            {...register('zipcode')}
            disabled={!toEdit}
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
