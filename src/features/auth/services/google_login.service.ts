import { REFRESH_TOKEN_EXPIRY_MS } from "@/conf/constants"
import { createAccessToken, createRefreshToken, hashToken } from "@/lib/tokens/hash.token"
import Session from "@/models/session.model"
import User from "@/models/user.model"
import { OAuth2Client } from "google-auth-library"

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

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()
        if (!payload?.email || !payload.sub) {
            return { ok: false, message: 'Invalid Google token payload' }
        }

        const { email, sub: googleId } = payload

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