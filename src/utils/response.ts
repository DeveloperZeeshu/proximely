import { NextResponse } from "next/server"

export const success = (
    message = '',
    data = {},
    status = 200
) => {
    return NextResponse.json({
        success: true,
        message,
        ...data
    }, { status })
}

export const error = (
    message = '',
    status = 500
) => {
    return NextResponse.json({
        success: false,
        message
    }, { status })
}
