import z from 'zod'

//Login form validator schema
export const loginSchema = z.object({
    email: z
        .email('Please enter a valid email')
        .trim()
        .toLowerCase()
        .max(100, 'Email must be less than 100 characters'),

    password: z
        .string()
        .trim()
        .min(8, 'Password must be at least 8 characters long')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            "Password must contain uppercase, lowercase, number, and special character"
        )
})

export type LoginFormData = z.infer<typeof loginSchema>

