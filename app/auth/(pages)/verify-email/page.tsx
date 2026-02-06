'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, MailCheck, X, Loader2 } from 'lucide-react'
import { handleAxiosError } from '@/apis/utils/handleAxiosError'
import { sendEmailVerification, verifyEmail } from '@/apis/auth.api'
import { setEmailStatus } from '@/store/auth/authSlice'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { useAuth } from '@/store/auth/useAuth'


const RESEND_DELAY = 60

export default function VerifyEmailPage() {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const router = useRouter()

  const { isAuth, isEmailVerified, authLoading } = useAuth()

  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const [resendTimer, setResendTimer] = useState(() => {
    if (typeof window === 'undefined') return 0
    const stored = localStorage.getItem('resend_timer')
    return stored ? Math.max(Number(stored), 0) : 0
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const sent = resendTimer > 0

  /* -------------------- Send Verification Email -------------------- */
  const sendVerifyEmail = async () => {
    if (!isAuth || sent || sending) return

    setSendError(null)
    setSending(true)

    try {
      await sendEmailVerification()
      localStorage.setItem('resend_timer', String(RESEND_DELAY))
      setResendTimer(RESEND_DELAY)
    } catch (err) {
      setSendError('Failed to send verification email.')
      handleAxiosError(err)
    } finally {
      setSending(false)
    }
  }

  /* -------------------- Verify Token -------------------- */
  const verifyEmailToken = useCallback(async () => {
    if (!token || authLoading || isEmailVerified) return

    setVerifyError(null)
    setVerifying(true)

    try {
      await verifyEmail(token)
      dispatch(setEmailStatus(true))
      localStorage.removeItem('resend_timer')
    } catch (err) {
      setVerifyError('Verification link is invalid or expired.')
      router.replace('/auth/verify-email')
      handleAxiosError(err)
    } finally {
      setVerifying(false)
    }
  }, [token, isEmailVerified, dispatch])

  /* -------------------- Countdown Timer -------------------- */
  useEffect(() => {
    if (!sent) return

    intervalRef.current = setInterval(() => {
      setResendTimer(prev => {
        const next = Math.max(prev - 1, 0)
        localStorage.setItem('resend_timer', String(next))

        if (next === 0) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          localStorage.removeItem('resend_timer')
        }

        return next
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [sent])

  /* -------------------- Auto Verify -------------------- */
  useEffect(() => {
    if (!authLoading && token && !isEmailVerified) {
      verifyEmailToken()
    }
  }, [token, isEmailVerified, verifyEmailToken])

  /* ==================== UI STATES ==================== */

  // Authenticating
  if (authLoading) {
    return (
      <CenteredCard>
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-6" />
        <h1 className="text-xl font-semibold text-slate-900 text-center">
          Checking your account
        </h1>
        <p className="text-sm text-slate-600 text-center mt-2">
          Please wait…
        </p>
      </CenteredCard>
    )
  }

  // Verifying card
  if (token && verifying) {
    return (
      <CenteredCard>
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-6" />
        <h1 className="text-xl font-semibold text-slate-900 text-center">
          Verifying your email
        </h1>
        <p className="text-sm text-slate-600 text-center mt-2">
          Please wait a moment…
        </p>
      </CenteredCard>
    )
  }

  // Verification failed
  if (token && verifyError) {
    return (
      <CenteredCard>
        <IconCircle color="red">
          <X className="text-red-600" />
        </IconCircle>

        <h1 className="text-xl font-semibold text-slate-900 text-center">
          Email verification failed
        </h1>

        <p className="text-sm text-slate-600 text-center mt-2">
          {verifyError}
        </p>

        <LinkButton href="/auth/verify-email" label="Retry" />
      </CenteredCard>
    )
  }

  // Verified
  if (isEmailVerified) {
    return (
      <CenteredCard>
        <IconCircle color="green">
          <Check className="text-green-600" />
        </IconCircle>

        <h1 className="text-xl font-semibold text-slate-900 text-center">
          Email verified
        </h1>

        <p className="text-sm text-slate-600 text-center mt-2">
          You can now access your dashboard.
        </p>

        <LinkButton href="/shop/dashboard" label="Go to dashboard" />
      </CenteredCard>
    )
  }

  // Default send card
  return (
    <CenteredCard>
      <IconCircle color="blue">
        <MailCheck className="text-blue-600" />
      </IconCircle>

      <h1 className="text-xl font-semibold text-slate-900 text-center">
        Verify your email
      </h1>

      <p className="text-sm text-slate-600 text-center mt-2">
        We’ll send you a verification link.
      </p>

      <button
        onClick={sendVerifyEmail}
        disabled={sent || sending}
        className="mt-6 w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 transition"
      >
        {sending
          ? 'Sending…'
          : sent
            ? 'Verification email sent'
            : 'Send verification email'}
      </button>

      {sendError && (
        <p className="mt-2 text-xs text-red-500 text-center">
          {sendError}
        </p>
      )}

      {sent && (
        <p className="mt-2 text-xs text-slate-500 text-right">
          Resend in {resendTimer}s
        </p>
      )}

      <p className="mt-6 text-xs text-slate-400 text-center">
        Check spam if you don’t see the email.
      </p>
    </CenteredCard>
  )
}

/* ==================== Reusable UI ==================== */

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-300 p-6 flex flex-col items-center">
        {children}
      </div>
    </div>
  )
}

function IconCircle({
  children,
  color,
}: {
  children: React.ReactNode
  color: 'blue' | 'green' | 'red'
}) {
  const map = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
  }

  return (
    <div className={`h-12 w-12 rounded-full ${map[color]} mb-6 flex items-center justify-center`}>
      {children}
    </div>
  )
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-8 w-full">
      <Link
        href={href}
        className="block w-full rounded-lg bg-blue-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-600 transition"
      >
        {label}
      </Link>
    </div>
  )
}
