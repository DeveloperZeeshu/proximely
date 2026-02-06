import 'server-only'

import { connectToDB } from "@/db/dbConnector"
import User from "@/models/user.model"
import argon2 from 'argon2'
import crypto from 'crypto'
import Session from '@/models/session.model'
import { ACCESS_TOKEN_EXPIRY_MS, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY_MS, VERIFICATION_TOKEN_EXPIRY_MS } from '@/conf/constants'
import jwt from 'jsonwebtoken'
import conf from '@/conf/conf'
import Shop from '@/models/shop.model'
import { createEmailVerifyToken } from '@/lib/tokens/verificationToken'
import EmailVerification from '@/models/email-verification.model'
import { OAuth2Client } from 'google-auth-library'

// Creating and hashing tokens
const createRefreshToken = (): string => {
    return crypto.randomBytes(64).toString('hex')
}

const hashToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex')
}

const createAccessToken = ({
    sub,
    sid
}: {
    sub: string
    sid: string
}): string => {
    return jwt.sign({
        sub,
        sid
    }, conf.jwt_secret, {
        expiresIn: ACCESS_TOKEN_EXPIRY_MS / MILLISECONDS_PER_SECOND
    })
}
// Creating and hashing tokens



// Login Service
type RoleType = 'USER' | 'ADMIN'

export type LoginErrorType =
    'INVALID_CREDENTIALS' | 'MISSING_FIELDS' | 'BAD_REQUEST'

type LoginResult =
    | { ok: true, hasShop: boolean, roles: RoleType[], isEmailVerified: boolean, accessToken: string, refreshToken: string }
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

    // Getting Shop info for frontend
    const hasShop = await Shop.exists({ ownerId: existingUser._id })

    return {
        ok: true,
        hasShop: Boolean(hasShop),
        roles: existingUser.roles,
        isEmailVerified: Boolean(existingUser.emailVerifiedAt),
        accessToken,
        refreshToken
    } as const
}


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


// Logout service
type LogoutResult =
    | { ok: true }
    | { ok: false, code: 'UNAUTHORIZED' }

export const logoutService = async ({
    sub,
    sid
}: {
    sub: string
    sid: string
}): Promise<LogoutResult> => {
    if (!sub || !sid) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    await connectToDB()

    const updatedSession = await Session.findOneAndDelete(
        { _id: sid, userId: sub, valid: true }
    )

    if (!updatedSession) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    return {
        ok: true,
    }
}


// Authorization service
type AuthorizeErrorType = 'UNAUTHORIZED'

type AuthorizeResult =
    | { ok: true, roles: RoleType[], isEmailVerified: boolean, hasShop: boolean }
    | { ok: false, code: AuthorizeErrorType }

export const authorizeService = async (
    token?: string
): Promise<AuthorizeResult> => {
    if (!token) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    await connectToDB()

    let decoded: jwt.JwtPayload

    try {
        decoded = jwt.verify(token, conf.jwt_secret) as jwt.JwtPayload
    } catch {
        return { ok: false, code: 'UNAUTHORIZED' }
    }

    if (!decoded.sub) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    const user = await User.findById(decoded.sub)
        .select('roles emailVerifiedAt')
        .lean()

    if (!user) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    const hasShop = await Shop.exists({ ownerId: decoded.sub })

    return {
        ok: true,
        roles: user.roles,
        isEmailVerified: Boolean(user.emailVerifiedAt),
        hasShop: Boolean(hasShop)
    }
}


// Refresh Token validation and rotation
type RefreshResult =
    | { ok: true, newAccessToken: string, newRefreshToken: string }
    | { ok: false, code: 'UNAUTHORIZED' }

export const refreshTokensService = async (
    token?: string
): Promise<RefreshResult> => {
    if (!token) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    await connectToDB()

    const newRefreshToken = createRefreshToken()
    const hashedOld = hashToken(token)
    const hashedNew = hashToken(newRefreshToken)


    const session = await Session.findOneAndUpdate(
        {
            refreshTokenHash: hashedOld,
            expiresAt: { $gt: new Date() },
            valid: true
        },
        { refreshTokenHash: hashedNew },
        { new: true }
    )

    if (!session) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    const newAccessToken = createAccessToken({
        sub: session.userId,
        sid: session._id
    })

    return {
        ok: true,
        newAccessToken,
        newRefreshToken
    }
}


// Send Verification Email service
export type SendVerifyEmailErrorType =
    | 'UNAUTHORIZED'
    | 'NOT_FOUND'
    | 'TOO_MANY_REQUESTS'

type SendVerifyEmailResult =
    | { ok: true, verifyUrl: string, email: string }
    | { ok: false, code: SendVerifyEmailErrorType }

export const sendVerifyEmailService = async ({
    sub
}: {
    sub: string
}): Promise<SendVerifyEmailResult> => {
    if (!sub) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    const user = await User.findOne({ _id: sub }).select('email')
    if (!user) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    const existing = await EmailVerification.findOne({ userId: sub })
    if (existing && existing.createdAt > new Date(Date.now() - 60_000)) {
        return {
            ok: false,
            code: 'TOO_MANY_REQUESTS'
        }
    }

    const token = createEmailVerifyToken()
    const tokenHash = hashToken(token)

    const emailToken = await EmailVerification.findOneAndUpdate(
        { userId: sub },
        {
            tokenHash,
            expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS)
        },
        { upsert: true, new: true }
    )

    const verifyUrl = `${conf.app_url}/auth/verify-email?token=${token}`

    return {
        ok: true,
        verifyUrl,
        email: user.email
    }
}


// Verify Email service
export type VerifyEmailErrorType =
    | 'NOT_FOUND'
    | 'TOO_MANY_REQUESTS'
    | 'INVALID_REQUEST'

type VerifyEmailResult =
    | { ok: true }
    | { ok: false, code: VerifyEmailErrorType }

export const verifyEmailService = async ({
    token
}: {
    token: string
}): Promise<VerifyEmailResult> => {

    if (!token) {
        return {
            ok: false,
            code: 'INVALID_REQUEST'
        }
    }

    const verification = await EmailVerification.findOne({
        tokenHash: hashToken(token)
    })

    if (!verification) {
        return {
            ok: false,
            code: 'INVALID_REQUEST'
        }
    }

    if (verification.expiresAt < new Date()) {
        await EmailVerification.deleteOne({ _id: verification._id })
        return {
            ok: false,
            code: 'INVALID_REQUEST'
        }
    }

    const user = await User.findById(verification.userId)

    if (!user) {
        await EmailVerification.deleteOne({ _id: verification._id })
        return { ok: false, code: 'NOT_FOUND' }
    }

    // already verified
    if (user.emailVerifiedAt) {
        await EmailVerification.deleteOne({ _id: verification._id })
        return { ok: true }
    }

    // verify user
    user.emailVerifiedAt = new Date()
    await user.save()

    // invalidate token (single-use)
    await EmailVerification.deleteOne({ _id: verification._id })

    return {
        ok: true
    }
}



// src/features/auth/service/googleAuthService.ts
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

type GoogleLoginServiceInput = {
    code: string
    userAgent: string
    ip: string
}

type GoogleLoginServiceResult =
    | { ok: true; accessToken: string; refreshToken: string; }
    | { ok: false; message: string }

export const handleGoogleLoginService = async ({
    code,
    userAgent,
    ip,
}: GoogleLoginServiceInput): Promise<GoogleLoginServiceResult> => {
    try {
        if (!code) return { ok: false, message: 'Missing Google code' }

        // ---------------- STEP 1: Exchange code for tokens ----------------
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
                grant_type: 'authorization_code',
                code,
            }),
        })

        if (!tokenRes.ok) return { ok: false, message: 'Failed to get tokens from Google' }

        const { id_token: idToken } = await tokenRes.json()
        if (!idToken) return { ok: false, message: 'No ID token returned by Google' }

        // ---------------- STEP 2: Verify ID token ----------------
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()
        if (!payload?.email || !payload.sub) {
            return { ok: false, message: 'Invalid Google token payload' }
        }

        const { email, sub: googleId } = payload

        // ---------------- STEP 3: Find or create user ----------------
        const existingUser = await User.findOne({ email })

        if (existingUser && existingUser.authProvider !== 'GOOGLE') {
            return {
                ok: false,
                message: 'This email is registered using password login.',
            }
        }

        let user = existingUser

        if (!user) {
            user = await User.create({
                email,
                emailVerifiedAt: new Date(),
                roles: ['USER'],
                authProvider: 'GOOGLE',
                providerId: googleId,
            })
        }

        // ---------------- STEP 4: Create session ----------------
        const refreshToken = createRefreshToken()
        const refreshTokenHash = hashToken(refreshToken)

        const session = await Session.create({
            userId: user._id,
            userAgent,
            ip,
            refreshTokenHash,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
        })

        const accessToken = createAccessToken({
            sub: user._id,
            sid: session._id,
        })

        // ---------------- Return result to route ----------------
        return {
            ok: true,
            accessToken,
            refreshToken
        }
    } catch (err) {
        console.error('Google login service error:', err)
        return { ok: false, message: 'Internal server error' }
    }
}

