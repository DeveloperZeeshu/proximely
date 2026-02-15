import { connectToDB } from "@/db/dbConnector"
import User from "@/models/user.model"
import argon2 from 'argon2'

// Registration Service
export type RegisterErrorType =
    'USER_EXISTS'

type RegisterResult =
    | { ok: true }
    | { ok: false, code: RegisterErrorType }

type RegisterInput = {
    email: string
    password: string
}

export const registerService = async ({
    email,
    password
}: RegisterInput): Promise<RegisterResult> => {

    await connectToDB()

    const passwordHash = await argon2.hash(password)

    try {
        await User.create({
            email,
            passwordHash,
            authProvider: 'CREDENTIALS',
            roles: ['USER'],
            isActive: true
        })
    } catch (err: any) {
        if (err.code === 11000) {
            return { ok: false, code: 'USER_EXISTS' }
        }
        throw err
    }

    return {
        ok: true,
    }
}