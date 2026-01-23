import { fetchShopDetails } from "@/src/apis/shop.api";
import { ShopInfoType } from "@/src/types/shop.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMyShop = createAsyncThunk<ShopInfoType>(
    'shop/fetchMyShop',
    async () => {
        const res = await fetchShopDetails()
        return res.shop
    }
)
