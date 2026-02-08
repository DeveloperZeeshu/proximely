import z from "zod";

export const productDiscoverySchema = z.object({
    query: z.object({
        search: z
            .string()
            .trim()
            .min(1)
            .max(100),

        category: z
            .string()
            .trim()
            .max(50)
            .optional(),

        location: z.object({
            latitude: z
                .number()
                .min(-90)
                .max(90),
            longitude: z
                .number()
                .min(-180)
                .max(180)
        }).strict(),

        radius: z
            .number()
            .min(5000)
            .optional(),

        sort: z
            .enum(['distance', 'price_asc', 'price_desc'])
            .default('distance')
    }).strict(),

    cursor: z
        .string()
        .min(10)
        .nullable()
        .optional(),
    dir: z
        .enum(['next', 'prev'])
        .nullable(),
    limit: z
        .number()
        .min(1)
        .optional()
})
    .strict()

export type ProductDiscoveryInput = z.infer<typeof productDiscoverySchema>
