import z from "zod";
import { addProductSchema } from "./add.schema";

export const updateProductSchema = addProductSchema
    .partial()
    .strict()

export type UpdateProductInput = z.infer<typeof updateProductSchema>
