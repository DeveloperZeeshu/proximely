import { NextRequest, NextResponse } from 'next/server'

const publicPaths = ['/auth/login', '/auth/register']
const protectedPaths = [
    '/shop/dashboard',
    '/shop/manage-products',
    '/shop/shop-pofile',
]

export function proxy(request: NextRequest) {
    try {
        const access = request.cookies.get('access_token')?.value
        const refresh = request.cookies.get('refresh_token')?.value
        const { pathname } = request.nextUrl

        const isPublic = publicPaths.some(p => pathname.startsWith(p))
        const isProtected = protectedPaths.some(p => pathname.startsWith(p))

        if ((access || refresh) && isPublic) {
            return NextResponse.redirect(
                new URL('/shop/dashboard', request.url)
            )
        }

        if ((!access && !refresh) && isProtected) {
            return NextResponse.redirect(
                new URL('/auth/login', request.url)
            )
        }

        return NextResponse.next()
    } catch (err) {
        console.error('Middleware error:', err)
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        '/auth/login',
        '/auth/register',
        '/shop/:path*',
    ],
}
