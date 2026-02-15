import logger from "core/logger";
import { AuthPayload, requireAuth } from "@/lib/auth/requireAuth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { logoutService } from "@/features/auth/services/logout.service";

export const POST = async (req: NextRequest) => {
    try {
        const { authPayload, success } = await requireAuth()
        if (!success) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized.'
            }, { status: 401 })
        }

        const { sub, sid } = authPayload as AuthPayload

        const result = await logoutService({
            sub,
            sid
        })

        if (!result.ok) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized.'
            }, { status: 401 })
        }

        const cookieStore = await cookies()

        cookieStore.delete({
            name: 'access_token',
            path: '/'
        })
        cookieStore.delete({
            name: 'refresh_token',
            path: '/'
        })

        return NextResponse.json({
            success: true,
            message: 'Logout successfully.'
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Unhandled logout error.',  err )

        return NextResponse.json({
            success: false,
            message: 'Internal server error.'
        }, { status: 500 })
    }
}
