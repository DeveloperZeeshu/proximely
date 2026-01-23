import z from 'zod'
import { loginSchema } from './login.schema'

//Registration form validation schema
export const registerSchema = loginSchema.extend({
    confirmPassword: z
        .string()
        .trim()
        .min(8, 'Confirm password is required'),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password do not match',
        path: ['confirmPassword']
    })

export type RegisterFormData = z.infer<typeof registerSchema>
