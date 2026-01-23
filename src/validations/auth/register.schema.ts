import z from 'zod'

//Registration form validation schema
export const registerSchema = z.object({
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

export type RegisterInput = z.infer<typeof registerSchema>
