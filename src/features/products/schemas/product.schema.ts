// product.form.schema.ts
import { PRODUCT_CATEGORIES_VALUE } from "@/lib/constants"
import { z } from "zod"

export const productFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Product name must be at least 3 characters long")
        .max(50),

    category: z.
        enum(PRODUCT_CATEGORIES_VALUE),

    price: z
        .string()
        .trim()
        .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number")
        .refine((val) => Number(val) > 0),

    description: z
        .string()
        .trim()
        .min(10)
        .max(150),

    currency: z.enum(["USD", "EUR", "INR"]).optional(),

    imageUrl: z.string().url().optional(),

    isAvailable: z.boolean().default(true).optional(),
})

export type ProductFormInput = z.infer<typeof productFormSchema>
