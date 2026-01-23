import { useSelector } from 'react-redux'
import {
    selectShop,
    selectShopLoading,
    selectShopError,
    selectShopHydrated
} from './shopSlice'

export const useShop = () => {
  const shop = useSelector(selectShop)
  const shopLoading = useSelector(selectShopLoading)
  const shopError = useSelector(selectShopError)
  const shopHydrated = useSelector(selectShopHydrated)

  return {
    shop,
    shopLoading,
    shopError,
    shopHydrated,
  }
}

