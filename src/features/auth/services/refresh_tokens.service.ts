import { connectToDB } from "@/db/dbConnector"
import { createAccessToken, createRefreshToken, hashToken } from "@/lib/tokens/hash.token"
import Session from "@/models/session.model"

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