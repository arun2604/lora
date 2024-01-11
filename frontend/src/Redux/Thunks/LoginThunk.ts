import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginModel } from "../../models/LoginModel";
import axios from "axios";
import Cookies from 'js-cookie';

const baseurl = process.env.REACT_APP_BASEURL;
export const validateLogin = createAsyncThunk('login/validate', async (params: LoginModel) => {
    try {
        const response = await axios.post(`${baseurl}/login`, params);
        if (response.data.status) {
            let expiryDate = new Date(response.data.data.expiresIn);
            Cookies.set("accessToken", response.data.data.accessToken, expiryDate);
            return response.data;
        } else {
            return response.data;
        }
    }
    catch (error: any) {
        return error.response.data;
    }
})