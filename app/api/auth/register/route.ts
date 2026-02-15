import logger from "core/logger";
import { registerSchema } from "@/validations/auth/register.schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { RegisterErrorType, registerService } from "@/features/auth/services/register.service";

const REGISTER_ERROR_MAP: Record<RegisterErrorType, {
    status: number,
    message: string
}> = {
    USER_EXISTS: { message: 'User already exists.', status: 409 },
}

export const POST = async (req: NextRequest) => {
    try {
        const untrustedData = await req.json()

        const parsedData = registerSchema.safeParse(untrustedData)

        if (parsedData.error) {
            const error = z.treeifyError(parsedData.error)

            return NextResponse.json({
                success: false,
                message: 'Invalid requested data.',
                errors: error
            }, { status: 422 })
        }

        const data = parsedData.data

        const result = await registerService({
            ...data,
        })

        if (!result.ok) {
            const err = REGISTER_ERROR_MAP[result.code]
            if (!err) {
                logger.error('Unhandled RegisterErrorType:', result.code)
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
            message: 'Registration successful.'
        }, { status: 201 })

    } catch (err: unknown) {
        logger.error('Unhandled registration error',
            err
        )

        return NextResponse.json({
            success: false,
            message: 'Internal server error.'
        }, { status: 500 })
    }
}

