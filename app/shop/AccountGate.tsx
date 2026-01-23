import { VerifyEmailCard } from "@/src/components/email/VerifyEmailCard"
import { NoShopCard } from "@/src/features/shop/components/NoShopCard"
import { useAuth } from "@/src/store/auth/useAuth"

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
