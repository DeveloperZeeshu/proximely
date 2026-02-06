'use client'

import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { ProductTabDetails } from "@/src/types/product.types";
import { handleAxiosError } from "@/src/apis/utils/handleAxiosError";
import Input from "@/src/components/ui/Input";
import { addProduct, editProduct } from "@/src/store/products/productsSlice";
import { useAppContext } from "@/src/context/AppContext";
import { createProduct, updateProduct } from "@/src/apis/product.api";
import { ProductFormInput, productFormSchema } from "../schemas/product.schema";
import { Button, LoadingButton } from "@/src/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/src/components/ui/select";

interface ProductFormProps {
  product: ProductTabDetails | null;
  mode: 'Add' | 'Edit';
}

export const ProductForm = ({ product, mode }: ProductFormProps) => {
  const { closeProductForm } = useAppContext();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      category: 'groceries',
      isAvailable: true
    }
  });

  useEffect(() => {
    reset({
      name: product?.name ?? '',
      category: product?.category ?? 'groceries',
      description: product?.description ?? '',
      price: product?.price != null ? String(product.price) : '',
      isAvailable: product?.isAvailable ?? true
    });
  }, [product, reset]);

  const submit: SubmitHandler<ProductFormInput> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        isAvailable: data.isAvailable
      };

      if (product) {
        const result = await updateProduct({ productId: product._id, payload });
        toast.success('Product updated successfully');
        dispatch(editProduct({ _id: product._id, product: result.updatedProduct }));
      } else {
        const result = await createProduct({ payload });
        toast.success('Product added successfully');
        dispatch(addProduct(result.newProduct));
      }

      closeProductForm();
      reset();
    } catch (err: unknown) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4">
        {/* Close button */}
        <button
          type="button"
          onClick={closeProductForm}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4 w-full">
          {/* Product Name */}
          <Input
            label="Product name"
            type="text"
            placeholder="Enter full name of product"
            errors={errors.name}
            {...register('name')}
          />

          {/* Price + Category */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Enter Price"
              label="Price"
              errors={errors.price}
              {...register('price')}
              className="flex-1"
            />

            <div className="flex flex-col">
              <label className="text-sm">Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="z-70">
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="groceries">Groceries</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Product Status Toggle */}
          {mode === 'Edit' && (
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
            </label>
          )}

          {/* Description */}
          <Input
            label="Description"
            type="text"
            placeholder="Enter Product Description"
            errors={errors.description}
            {...register('description')}
          />

          {/* Submit button */}
          <div className="flex justify-center mt-3">
            {loading ? (
              <LoadingButton />
            ) : (
              <Button type="submit" text={mode} className="w-full" />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
