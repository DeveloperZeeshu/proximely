import z from "zod";
import { productFormSchema } from "./product.schema";

export const updateProductSchema = productFormSchema
    .extend({
        isDeleted: z
            .boolean()
            .default(false)
    })
    .partial()
    .strict()

export type UpdateProductInput = z.infer<typeof updateProductSchema>
