// app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { cookieConfig } from '@/conf/cookieConfig'
import { ACCESS_TOKEN_EXPIRY_MS, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY_MS } from '@/conf/constants'
import { handleGoogleLoginService } from '@/features/auth/services/google_login.service'

export const GET = async (req: NextRequest) => {
    try {
        // ---------------- Fetch route-level info ----------------
        const userAgent = req.headers.get('user-agent') ?? 'unknown'
        const forwardedFor = req.headers.get('x-forwarded-for')
        const ip = forwardedFor?.split(',')[0].trim() ?? 'unknown'

        // ---------------- Call service ----------------
        const result = await handleGoogleLoginService({
            code: req.nextUrl.searchParams.get('code')!,
            userAgent,
            ip
        })

        if (!result.ok) {
            return NextResponse.redirect(new URL('/auth/login', req.url))
        }

        // ---------------- Side-effects in route ----------------
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

        // ---------------- Return / redirect ----------------
        return NextResponse.redirect(new URL('/shop/dashboard', req.url))
    } catch (err: unknown) {
        console.error('Google OAuth route error:', err)
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }
}
