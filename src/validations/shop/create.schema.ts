
import { SHOP_CATEGORIES_VALUE } from '@/lib/constants'
import { z } from 'zod'

export const createShopSchema = z.object({
    shopName: z.string().trim().min(1).max(50),
    ownerName: z.string().trim().min(1).max(50),

    phone: z
        .string()
        .trim()
        .regex(/^[0-9+\-\s]{7,15}$/),

    category: z.enum(SHOP_CATEGORIES_VALUE)
})
.strict()


export type CreateShopInput = z.infer<typeof createShopSchema>
