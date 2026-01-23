import { useSelector } from "react-redux"
import { selectAuthError, selectAuthLoading, selectHasShop, selectIsAuth, selectIsEmailVerified } from "./authSlice"

export const useAuth = () => {
  const isAuth = useSelector(selectIsAuth)
  const authLoading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const hasShop = useSelector(selectHasShop)
  const isEmailVerified = useSelector(selectIsEmailVerified)

  return {
    isAuth,
    authLoading,
    authError,
    hasShop,
    isEmailVerified
  }
}
