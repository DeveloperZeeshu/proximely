import rateLimit from '@/config/rateLimit'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

const publicPaths = ['/auth/login', '/auth/register']
const protectedPaths = [
    '/shop/dashboard',
    '/shop/manage-products',
    '/shop/shop-pofile',
]

// Routes to rate limit (unauthenticated)
const RATE_LIMITED_ROUTES = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/google',
    '/api/auth/verify-email',
    '/api/auth/verify-email/resend',
    '/api/products'
]

// Per-route custom limits
const ROUTE_LIMITS: Record<string, number> = {
    '/api/auth/login': 5,
    '/api/auth/register': 3,
    '/api/auth/google': 5,
    '/api/auth/verify-email': 5,
    '/api/auth/verify-email/resend': 3,
    '/api/products': 10
}

export async function proxy(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl
        const ip = (request.headers.get('x-forwarded-for') || '127.0.0.1').split(',')[0].trim()

        const matchedRoute = RATE_LIMITED_ROUTES.find(route =>
            pathname === route || pathname.startsWith(route + '/')
        )

        if (matchedRoute) {
            const limit = ROUTE_LIMITS[pathname] || 5
            const limiter = rateLimit(limit)
            const result = await limiter.limit(ip)

            if (!result.success) {
                return NextResponse.json({
                    success: false,
                    message: 'Too many requests'
                }, { status: 429 })
            }
        }

        const access = request.cookies.get('access_token')?.value
        const refresh = request.cookies.get('refresh_token')?.value

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
        '/api/auth/:path*',
        '/api/products/search'
    ],
}
