import conf from "@/conf/conf"
import { connectToDB } from "@/db/dbConnector"
import Shop from "@/models/shop.model"
import User from "@/models/user.model"
import { RoleType } from "@/types/auth.types"
import jwt from 'jsonwebtoken'

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