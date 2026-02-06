import { authorizeUser } from "@/apis/auth.api";
import { SetAuthPayloadType } from "@/types/auth.types";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const authorize = createAsyncThunk<
    SetAuthPayloadType
>(
    'auth/authorize',
    async () => {
        const res = await authorizeUser()
        return {
            roles: res.roles,
            isEmailVerified: res.isEmailVerified,
            hasShop: res.hasShop
        }
    }
)
