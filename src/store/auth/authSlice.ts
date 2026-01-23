import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authorize } from "./authThunks";
import { RoleType, SetAuthPayloadType } from "@/src/types/auth.types";

export type AuthStatus =
  | "loading"          
  | "authenticated"   
  | "unauthenticated"  

export interface AuthState {
  authStatus: AuthStatus
  roles: RoleType[]
  isEmailVerified: boolean
  hasShop: boolean
  error: string | null
  hydrated: boolean     
}

const initialState: AuthState = {
  authStatus: "loading",
  roles: [],
  isEmailVerified: false,
  hasShop: false,
  error: null,
  hydrated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.authStatus = "unauthenticated";
      state.roles = [];
      state.isEmailVerified = false;
      state.hasShop = false;
      state.error = null;
      state.hydrated = true;
    },

    setEmailStatus: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },

    setShopStatus: (state, action: PayloadAction<boolean>) => {
      state.hasShop = action.payload;
    },

    setAuthHydrated: (state, action: PayloadAction<boolean>) => {
      state.hydrated = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authorize.pending, (state) => {
        state.authStatus = "loading";
        state.error = null;
      })
      .addCase(authorize.fulfilled, (state, action: PayloadAction<SetAuthPayloadType>) => {
        state.authStatus = "authenticated";
        state.roles = action.payload.roles;
        state.hasShop = action.payload.hasShop;
        state.isEmailVerified = action.payload.isEmailVerified;
        state.error = null;
        state.hydrated = true;
      })
      .addCase(authorize.rejected, (state, action) => {
        state.authStatus = "unauthenticated";
        state.roles = [];
        state.hasShop = false;
        state.isEmailVerified = false;
        state.error = action.error.message ?? "Authentication failed";
        state.hydrated = true;
      });
  }
});


export const selectIsAuth = (state: { auth: AuthState }) =>
  state.auth.authStatus === "authenticated";

export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.authStatus === "loading";

export const selectHasShop = (state: { auth: AuthState }) =>
  state.auth.hasShop;

export const selectIsEmailVerified = (state: { auth: AuthState }) =>
  state.auth.isEmailVerified;

export const selectAuthError = (state: { auth: AuthState }) =>
  state.auth.error;

export const selectAuthHydrated = (state: { auth: AuthState }) =>
  state.auth.hydrated;

export const { clearAuth, setEmailStatus, setShopStatus, setAuthHydrated } =
  authSlice.actions;

export default authSlice.reducer;
