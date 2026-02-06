import { useSelector } from "react-redux"
import {
    selectProductDiscoveryError,
    selectProductDiscoveryHasNext,
    selectProductDiscoveryHasPrev,
    selectProductDiscoveryItems,
    selectProductDiscoveryLoading,
    selectProductDiscoveryNextCursor,
    selectProductDiscoveryPrevCursor
} from "./productDiscoverySlice"

export const useProductDiscovery = () => {
    const productDiscoveryItems = useSelector(selectProductDiscoveryItems)
    const productDiscoveryLoading = useSelector(selectProductDiscoveryLoading)
    const productDiscoveryError = useSelector(selectProductDiscoveryError)
    const productDiscoveryPrevCursor = useSelector(selectProductDiscoveryPrevCursor)
    const productDiscoveryNextCursor = useSelector(selectProductDiscoveryNextCursor)
    const productDiscoveryHasPrev = useSelector(selectProductDiscoveryHasPrev)
    const productDiscoveryHasNext = useSelector(selectProductDiscoveryHasNext)

    return {
        productDiscoveryItems,
        productDiscoveryLoading,
        productDiscoveryError,
        productDiscoveryPrevCursor,
        productDiscoveryNextCursor,
        productDiscoveryHasPrev,
        productDiscoveryHasNext
    }
}
