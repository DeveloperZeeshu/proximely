import conf from "@/conf/conf"
import { VERIFICATION_TOKEN_EXPIRY_MS } from "@/conf/constants"
import { hashToken } from "@/lib/tokens/hash.token"
import { createEmailVerifyToken } from "@/lib/tokens/verificationToken"
import EmailVerification from "@/models/email-verification.model"
import User from "@/models/user.model"

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