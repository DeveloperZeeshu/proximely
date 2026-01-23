import logger from "@/core/logger"
import { VerifyEmailErrorType, verifyEmailService } from "@/src/features/auth/service"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const VERIFY_EMAIL_MAP: Record<VerifyEmailErrorType, {
    status: number
    message: string
}> = {
    NOT_FOUND: { message: 'User not found.', status: 404 },
    TOO_MANY_REQUESTS: { message: 'Too many requests.', status: 429 },
    INVALID_REQUEST: { message: 'Invalid request.', status: 400 }
}

const parseToken = z.object({
    token: z.string().trim().min(5)
}).strict()

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json()
        const { token } = parseToken.parse(data)

        const result = await verifyEmailService({
            token
        })

        if (!result.ok) {
            const err = VERIFY_EMAIL_MAP[result.code]

            if (!err) {
                logger.error('Unhandled VerifyEmailError', { code: result.code })

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
            message: 'Email verified successfully.'
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Email verification failed error', { err })

        return NextResponse.json({
            success: false,
            message: 'Invalid request.'
        }, { status: 400 })
    }
}
