import z from "zod";

export const searchProductSchema = z.object({
    query: z.object({
        name: z
            .string()
            .trim()
            .min(1)
            .max(100),

        category: z
            .string()
            .trim()
            .max(50)
            .optional(),

        radius: z
            .number()
            .min(5000)
            .optional(),
    }).strict(),

    coordinates: z.object({
        latitude: z
            .number()
            .min(-90)
            .max(90),

        longitude: z
            .number()
            .min(-180)
            .max(180)
    }).strict()
})
    .strict()

export type SearchProductInput = z.infer<typeof searchProductSchema>
