import z from "zod";
import { createShopSchema } from "./create.schema";
import { CITY_VALUES, STATE_VALUES } from "@/lib/constants";

export const updateShopSchema = createShopSchema
    .extend({
        isProfileCompleted: z.boolean().default(false),
        isActive: z.boolean().default(true),
        isDeleted: z.boolean().default(false),

        address: z.string().trim().min(1).max(100),
        city: z.enum(CITY_VALUES),
        state: z.enum(STATE_VALUES),

        zipcode: z
            .string()
            .trim()
            .regex(/^[0-9]{4,10}$/),

        imageUrl: z.string().url().trim(),

        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180)
    })
    .partial()
    .strict()

export type UpdateShopInput = z.infer<typeof updateShopSchema>
