import logger from "@/core/logger";
import { authorizeService } from "@/src/features/auth/service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const AUTHORIZE_ERROR_MAP = {
    UNAUTHORIZED: { message: 'Unauthorized.', status: 401 }
} as const

export const GET = async (req: NextRequest) => {
    try {
        const token = (await cookies()).get('access_token')?.value

        const result = await authorizeService(token)

        if (!result.ok) {
            const err = AUTHORIZE_ERROR_MAP[result.code]
            if (!err) {
                logger.error('Unhandled AuthorizeErrorType.', { code: result.code })

                return NextResponse.json({
                    success: false,
                    message: 'Internal server error.'
                }, { status: 500 })
            }
            return NextResponse.json({
                success: false,
                message: err.message
            }, { status: err.status })
        }

        return NextResponse.json({
            success: true,
            roles: result.roles,
            isEmailVerified: result.isEmailVerified,
            hasShop: result.hasShop
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Unhandled authorization error.', { err })

        return NextResponse.json({
            success: false,
            message: 'Internal server error.'
        }, { status: 500 })
    }
}
