import z from "zod";

export const createShopSchema = z.object({
    shopName: z.string().trim().min(1).max(50),
    ownerName: z.string().trim().min(1).max(50),

    category: z.string().trim().min(2),

    phone: z
        .string()
        .trim()
        .regex(/^[0-9+\-\s]{7,15}$/)
})
    .strict()


export type CreateShopInput = z.infer<typeof createShopSchema>
