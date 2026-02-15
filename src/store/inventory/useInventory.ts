import { useSelector } from "react-redux"
import { selectHasMore, selectInventoryError, selectInventoryLoading, selectInventorySearch, selectInventorySort, selectItems, selectNextCursor } from "./inventorySlice"

export const useInventory = () => {
  const items = useSelector(selectItems)
  const inventoryLoading = useSelector(selectInventoryLoading)
  const inventoryError = useSelector(selectInventoryError)
  const hasMore = useSelector(selectHasMore)
  const nextCursor = useSelector(selectNextCursor)
  const search = useSelector(selectInventorySearch)
  const sort = useSelector(selectInventorySort)

  return {
    items,
    inventoryLoading,
    inventoryError,
    hasMore,
    nextCursor,
    sort,
    search
  }
}
