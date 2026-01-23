import { useSelector } from "react-redux"
import { selectHasNext, selectHasPrev, selectNextCursor, selectPrevCursor, selectProducts, selectProductsError, selectProductsLoading } from "./productsSlice"

export const useProducts = () => {
  const products = useSelector(selectProducts)
  const productsLoading = useSelector(selectProductsLoading)
  const productsError = useSelector(selectProductsError)
  const hasNext = useSelector(selectHasNext)
  const hasPrev = useSelector(selectHasPrev)
  const nextCursor = useSelector(selectNextCursor)
  const prevCursor = useSelector(selectPrevCursor)

  return {
    products,
    productsLoading,
    productsError,
    hasNext,
    hasPrev,
    nextCursor,
    prevCursor
  }
}
