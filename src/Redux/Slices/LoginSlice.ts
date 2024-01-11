import { createSlice } from "@reduxjs/toolkit";
import { validateLogin } from "../Thunks/LoginThunk";

let initialState = {
    loginData: {},
    isLoading: false,
    error: null as any
}

const LoginSlice = createSlice({
    name: 'login',
    initialState: initialState,
    reducers: {},
})

export const loginReducer = LoginSlice.reducer;