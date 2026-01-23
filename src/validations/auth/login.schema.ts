import z from 'zod'

//Login form validator schema
export const loginSchema = z.object({
    email: z
        .string()
        .email()
        .trim()
        .toLowerCase()
        .max(255),

    password: z
        .string()
        .trim()
        .min(8)
        .max(128)
})
    .strict()

export type LoginInput = z.infer<typeof loginSchema>