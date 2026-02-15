import { ACCESS_TOKEN_EXPIRY_MS, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY_MS } from "@/conf/constants";
import { cookieConfig } from "@/conf/cookieConfig";
import { LoginErrorType, loginService } from "@/features/auth/services/login.service";
import { loginSchema } from "@/validations/auth/login.schema";
import logger from "core/logger";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const LOGIN_ERROR_MAP: Record<LoginErrorType, {
    status: number
    message: string
}> = {
    MISSING_FIELDS: { status: 400, message: 'Missing email or password.' },
    INVALID_CREDENTIALS: { status: 401, message: 'Invalid credentials.' },
    BAD_REQUEST: { status: 400, message: 'This account was created using Google. Please sign in with Google.' }
}

export const POST = async (req: NextRequest) => {
    try {
        const untrustedData = await req.json()

        const parsedData = loginSchema.safeParse(untrustedData)

        if (parsedData.error) {
            const error = z.treeifyError(parsedData.error)

            return NextResponse.json({
                success: false,
                message: 'Invalid requested data.',
                errors: error
            }, { status: 422 })
        }

        // Getting ip and user-agent
        const userAgent = req.headers.get('user-agent') ?? 'unknown'
        const forwardedFor = req.headers.get('x-forwarded-for')
        const ip = forwardedFor?.split(',')[0].trim() ?? 'unknown'

        const data = parsedData.data

        const result = await loginService({
            ...data,
            userAgent,
            ip
        })

        if (!result.ok) {
            const err = LOGIN_ERROR_MAP[result.code]
            if (!err) {
                logger.error('Unhandled LoginErrorType:', result.code)

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

        // Setting cookies
        const cookieStore = await cookies()

        cookieStore.set('access_token', result.accessToken, {
            ...cookieConfig,
            maxAge: ACCESS_TOKEN_EXPIRY_MS / MILLISECONDS_PER_SECOND,
            path: '/'
        });

        cookieStore.set('refresh_token', result.refreshToken, {
            ...cookieConfig,
            maxAge: REFRESH_TOKEN_EXPIRY_MS / MILLISECONDS_PER_SECOND,
            path: '/'
        })

        return NextResponse.json({
            success: true,
            message: 'Logged in successfully.',
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Login Api Error:', err)

        return NextResponse.json({
            success: false,
            message: 'Internal server error.'
        }, { status: 500 })
    }
}


