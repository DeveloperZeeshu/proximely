'use client'

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { ProductTabDetails } from "@/src/types/product.types";
import { handleAxiosError } from "@/src/apis/utils/handleAxiosError";
import Input from "@/src/components/ui/Input";
import Select from "@/src/components/ui/Select";
import { addProduct, editProduct } from "@/src/store/products/productsSlice";
import { useAppContext } from "@/src/context/AppContext";
import { createProduct, updateProduct } from "@/src/apis/product.api";
import { ProductFormInput, productFormSchema } from "../schemas/product.schema";
import { Button, LoadingButton } from "@/src/components/ui/button";

interface ProductFormProps {
  product: ProductTabDetails | null
  mode: 'Add' | 'Edit'
}

export const ProductForm = ({ product, mode }: ProductFormProps) => {
  const { closeProductForm } = useAppContext()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  // ---- Form setup ----
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      category: 'groceries',
      isAvailable: true
    }
  })

  // ---- Populate form for edit or defaults for add ----
  useEffect(() => {
    reset({
      name: product?.name ?? '',
      category: product?.category ?? 'groceries',
      description: product?.description ?? '',
      price: product?.price != null ? String(product.price) : '',
      isAvailable: product?.isAvailable ?? true
    })
  }, [product, reset])

  // ---- Submit handler ----
  const submit: SubmitHandler<ProductFormInput> = async (data) => {
    setLoading(true)

    try {
      // Map form -> API payload
      const payload = {
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        isAvailable: data.isAvailable
      }

      if (product) {
        const result = await updateProduct({ productId: product._id, payload })
        toast.success('Product updated successfully')
        dispatch(editProduct({ _id: product._id, product: result.updatedProduct }))
      } else {
        const result = await createProduct({ payload })
        toast.success('Product added successfully')
        dispatch(addProduct(result.newProduct))
      }

      closeProductForm()
      reset()
    } catch (err: unknown) {
      handleAxiosError(err)
    } finally {
      setLoading(false)
    }
  }

  // ---- Render ----
  return (
    <div className='w-full flex justify-center'>
      <div className="z-60 fixed flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm top-40 rounded-xl p-4 shadow-xl">
        {/* Close button */}
        <p className="flex justify-end w-full">
          <X className="text-2xl cursor-pointer mb-1" onClick={closeProductForm} />
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(submit)}
          className="min-w-[20rem] w-auto lg:w-110 gap-4 flex flex-col"
        >
          {/* Product Name */}
          <Input
            label="Product name"
            type="text"
            placeholder="Enter full name of product"
            errors={errors.name}
            {...register('name')}
          />

          {/* Price + Category */}
          <div className='flex w-full gap-4'>
            <Input
              type="text"
              placeholder="Enter Price"
              label="Price"
              errors={errors.price}
              {...register('price')}
            />
            <Select
              label="Category"
              options={['groceries', 'electronics', 'clothing']}
              errors={errors.category}
              {...register('category')}
            />
          </div>

          {/* Product Status Toggle */}
          {mode === 'Edit' &&
            <label className="flex items-center justify-between border border-gray-300 rounded-lg bg-white px-3 py-2 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">Product Status</p>
                <p className="text-xs text-gray-500">Enable or disable this product</p>
              </div>

              <div className="relative">
                <input
                  type="checkbox"
                  {...register("isAvailable")}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-green-600 transition" />
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
              </div>
            </label>}

          {/* Description */}
          <Input
            label="Description"
            type="text"
            placeholder="Enter Product Description"
            errors={errors.description}
            {...register('description')}
          />

          {/* Submit button */}
          <div className="flex w-full justify-center mt-3 gap-4">
            {loading ? <LoadingButton /> : <Button type="submit" text={mode} className='w-full' />}
          </div>
        </form>
      </div>
    </div>
  )
}
