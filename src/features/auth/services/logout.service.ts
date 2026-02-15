import { connectToDB } from "@/db/dbConnector"
import Session from "@/models/session.model"

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