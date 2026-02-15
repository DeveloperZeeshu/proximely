import { REFRESH_TOKEN_EXPIRY_MS } from "@/conf/constants"
import { connectToDB } from "@/db/dbConnector"
import { createAccessToken, createRefreshToken, hashToken } from "@/lib/tokens/hash.token"
import Session from "@/models/session.model"
import User from "@/models/user.model"
import argon2 from 'argon2'

// Login Service
type RoleType = 'USER' | 'ADMIN'

export type LoginErrorType =
    'INVALID_CREDENTIALS' | 'MISSING_FIELDS' | 'BAD_REQUEST'

type LoginResult =
    | { ok: true, accessToken: string, refreshToken: string }
    | { ok: false, code: LoginErrorType }

type LoginInput = {
    email: string
    password: string
    userAgent: string
    ip: string
}

export const loginService = async ({
    email,
    password,
    userAgent,
    ip
}: LoginInput): Promise<LoginResult> => {
    if (!email || !password) {
        return {
            ok: false,
            code: 'MISSING_FIELDS'
        }
    }

    await connectToDB()

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
        return {
            ok: false,
            code: 'INVALID_CREDENTIALS'
        } as const
    }

    if(existingUser.authProvider === 'GOOGLE'){
        return {
            ok: false,
            code: 'BAD_REQUEST'
        }
    }

    const isPasswordValid = await argon2.verify(existingUser.passwordHash, password)
    if (!isPasswordValid) {
        return {
            ok: false,
            code: 'INVALID_CREDENTIALS'
        } as const
    }

    // Create Refresh token and its hash
    const refreshToken = createRefreshToken()
    const refreshTokenHash = hashToken(refreshToken)

    // Creating Session
    const session = await Session.create({
        userId: existingUser._id,
        userAgent,
        ip,
        refreshTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS)
    })

    // Creating Access token
    const accessToken = createAccessToken({
        sub: existingUser._id,
        sid: session._id
    })

    return {
        ok: true,
        accessToken,
        refreshToken
    } as const
}
