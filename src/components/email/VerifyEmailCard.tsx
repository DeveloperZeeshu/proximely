'use client'

import { Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function VerifyEmailCard() {
  const router = useRouter()

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Mail size={20} className="text-blue-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900">
              Verify your email
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Your email address is not verified yet.
              Verify it to unlock all features.
            </p>

            <button
              onClick={() => router.push('/auth/verify-email')}
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
            >
              Go to email verification
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
