import { hashToken } from "@/lib/tokens/hash.token"
import EmailVerification from "@/models/email-verification.model"
import User from "@/models/user.model"

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