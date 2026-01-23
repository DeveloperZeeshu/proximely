'use client'

import { cn } from '@/lib/utils'
import { Store } from 'lucide-react'
import { useRouter } from 'next/navigation'

type NoShopCardProps = {
  title?: string
  description?: string
  ctaLabel?: string
  redirectTo?: string
  className?: string
}

export function NoShopCard({
  title = 'Create your shop',
  description = 'You don’t have a shop yet. Create one to list products, manage prices, and start appearing in nearby searches.',
  ctaLabel = 'Create shop',
  redirectTo = '/shop/onboarding',
  className,
}: NoShopCardProps) {
  const router = useRouter()

  return (
    <div
      className={cn(
        'flex min-h-[60vh] w-full items-center justify-center rounded-xl border border-gray-300 bg-white p-8',
        className
      )}
    >
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Store size={20} className="text-blue-600" />
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          {description}
        </p>

        <button
          onClick={() => router.push(redirectTo)}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}
