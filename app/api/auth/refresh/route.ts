import logger from "core/logger";
import { ACCESS_TOKEN_EXPIRY_MS, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY_MS } from "@/conf/constants";
import { cookieConfig } from "@/conf/cookieConfig";
import { refreshTokensService } from "@/features/auth/service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const cookieStore = await cookies()

        const token = cookieStore.get('refresh_token')?.value

        const result = await refreshTokensService(token)

        if (!result.ok) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized.'
            }, { status: 401 })
        }

        cookieStore.set('refresh_token', result.newRefreshToken, {
            ...cookieConfig,
            maxAge: REFRESH_TOKEN_EXPIRY_MS / MILLISECONDS_PER_SECOND,
            path: '/'
        })

        cookieStore.set('access_token', result.newAccessToken, {
            ...cookieConfig,
            maxAge: ACCESS_TOKEN_EXPIRY_MS / MILLISECONDS_PER_SECOND,
            path: '/'
        })

        return NextResponse.json({
            success: true
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Refresh Error:', { err })

        return NextResponse.json({
            success: false,
            message: 'Internal server error.'
        }, { status: 500 })
    }
}
