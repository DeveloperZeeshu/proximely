'use server'
import 'server-only'

import { cookies } from "next/headers"
import jwt, { JwtPayload } from 'jsonwebtoken'
import conf from "@/src/conf/conf"

export type AuthPayload = JwtPayload & {
    sub: string
    sid: string
}

type requireAuthResult = {
    authPayload: AuthPayload | null
    success: boolean
}

export const requireAuth = async (

): Promise<requireAuthResult> => {
    const token = (await cookies()).get('access_token')?.value

    if (!token) {
        return {
            authPayload: null,
            success: false
        }
    }

    try {
        const decoded = jwt.verify(token, conf.jwt_secret) as AuthPayload
        return {
            authPayload: decoded,
            success: true
        }
    } catch (err: unknown) {
        console.error('Auth Verification Error:', err)
        return {
            authPayload: null,
            success: false
        }
    }
}
