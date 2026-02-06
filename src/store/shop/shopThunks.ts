import { fetchShopDetails } from "@/apis/shop.api";
import { ShopInfoType } from "@/types/shop.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMyShop = createAsyncThunk<ShopInfoType>(
    'shop/fetchMyShop',
    async () => {
        const res = await fetchShopDetails()
        return res.shop
    }
)
