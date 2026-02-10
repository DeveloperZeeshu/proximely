import { PRODUCT_CATEGORIES_VALUE } from "@/lib/constants";
import z from "zod";

export const addProductSchema = z.object({
    name: z
        .string()
        .trim()
        .max(50),

    category: z
        .enum(PRODUCT_CATEGORIES_VALUE),

    price: z
        .coerce
        .number()
        .min(1),

    description: z
        .string()
        .trim()
        .max(150),

    currency: z
        .enum(['USD', 'EUR', 'INR'])
        .default('INR'),

    imageUrl: z
        .url()
        .trim()
        .default(''),

    isAvailable: z
        .boolean()
        .default(true),

    isDeleted: z
        .boolean()
        .default(false)
})
    .strict()

export type AddProductInput = z.infer<typeof addProductSchema>
