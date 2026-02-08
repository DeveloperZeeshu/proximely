import logger from "core/logger";
import { VerifyEmailTemplate } from "@/components/email/templates/VerifyEmailTemplate";
import conf from "@/conf/conf";
import { SendVerifyEmailErrorType, sendVerifyEmailService } from "@/features/auth/service";
import { AuthPayload, requireAuth } from "@/lib/auth/requireAuth";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SEND_VERIFY_EMAIL_MAP: Record<SendVerifyEmailErrorType, {
    status: number
    message: string
}> = {
    NOT_FOUND: { message: 'User not found.', status: 404 },
    UNAUTHORIZED: { message: 'Unauthorized.', status: 409 },
    TOO_MANY_REQUESTS: { message: 'Too many requests', status: 429 }
}

const resend = new Resend(conf.resend_api_key)

export const POST = async (req: NextRequest) => {
    try {
        const { authPayload, success } = await requireAuth()
        if (!success) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized.'
            }, { status: 401 })
        }

        const { sub } = authPayload as AuthPayload

        const result = await sendVerifyEmailService({
            sub
        })

        if (!result.ok) {
            const err = SEND_VERIFY_EMAIL_MAP[result.code]

            if (!err) {
                logger.error('Unhandled SendVerifyEmailError', result.code)

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

        const { verifyUrl, email } = result

        if (!verifyUrl || !email) {
            return NextResponse.json({
                success: false,
                message: 'Internal server error.'
            }, { status: 500 })
        }

        const { error } = await resend.emails.send({
            from: 'Proximely <no-reply@proximely.in>',
            to: email,
            subject: 'Verify your email to get started',
            react: VerifyEmailTemplate({
                verifyUrl,
            })
        })

        if (error) {
            logger.error('Resend error', { error, email })
            return NextResponse.json({
                success: false,
                message: 'Failed to send email.'
            }, { status: 500 })
        }

        logger.info('Verification email sent.', { email })

        return NextResponse.json({
            success: true,
            message: 'Verification email sent.'
        }, { status: 200 })
    } catch (err: unknown) {
        logger.error('Send email verification error', err)

        return NextResponse.json({
            success: false,
            message: 'Invalid request.'
        }, { status: 400 })
    }
}
