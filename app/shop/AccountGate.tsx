import { VerifyEmailCard } from "@/components/email/VerifyEmailCard"
import { NoShopCard } from "@/features/shop/components/NoShopCard"
import { useAuth } from "@/store/auth/useAuth"

export function AccountGate({ children }: { children: React.ReactNode }) {
  const { isEmailVerified, hasShop } = useAuth()

  if (!isEmailVerified) {
    return <VerifyEmailCard />
  }

  if (!hasShop) {
    return <NoShopCard />
  }

  return <>{children}</>
}
