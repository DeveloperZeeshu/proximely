import { useSelector } from "react-redux"
import {
    selectProductDiscoveryError,
    selectProductDiscoveryHasMore,
    selectProductDiscoveryItems,
    selectProductDiscoveryLoading,
    selectProductDiscoveryNextCursor,
} from "./productDiscoverySlice"

export const useProductDiscovery = () => {
    const productDiscoveryItems = useSelector(selectProductDiscoveryItems)
    const productDiscoveryLoading = useSelector(selectProductDiscoveryLoading)
    const productDiscoveryError = useSelector(selectProductDiscoveryError)
    const productDiscoveryNextCursor = useSelector(selectProductDiscoveryNextCursor)
    const productDiscoveryHasMore = useSelector(selectProductDiscoveryHasMore)

    return {
        productDiscoveryItems,
        productDiscoveryLoading,
        productDiscoveryError,
        productDiscoveryNextCursor,
        productDiscoveryHasMore
    }
}
