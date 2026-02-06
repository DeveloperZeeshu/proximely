"use client"

import Container from "@/components/container/Container"
import { VerifyEmailCard } from "@/components/email/VerifyEmailCard"
import { OnboardingCard } from "@/features/shop/components/onboarding/OnboardingCard"
import { useAuth } from "@/store/auth/useAuth"
import { Store } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ShopOnboardingPage() {
    const { hasShop, authLoading, isEmailVerified } = useAuth()

    const router = useRouter()

    if (!authLoading && !isEmailVerified) {
        return (
            <Container>
                <VerifyEmailCard />
            </Container>
        )
    }

    if (!authLoading && hasShop) {
        return (
            <Container>
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                            <Store className="h-6 w-6 text-blue-500" />
                        </div>

                        <h1 className="mb-2 text-xl font-semibold">
                            You already have a shop
                        </h1>

                        <p className="mb-6 text-sm text-muted-foreground">
                            You can manage your shop and settings from your dashboard.
                        </p>

                        <button
                            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition"
                            onClick={() => router.push('dashboard')}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <div className="mb-8 max-w-xl mx-auto">
                <div className="flex flex-col justify-between mb-10">
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Set up your shop
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Complete your shop profile to start using all features.
                    </p>
                </div>

                <OnboardingCard />
            </div>
        </Container>
    )
}
