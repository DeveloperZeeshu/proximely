import z from 'zod'

export const searchProductsSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Enter at least 3 characters'),

    category: z
        .string()
        .trim()
        .optional(),

    radius: z
        .number()
        .min(1000)
        .max(50000)
        .default(5000)

})

export type SearchProductInput = z.infer<typeof searchProductsSchema>
