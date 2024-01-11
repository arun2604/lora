import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getHeaderToken } from "../utils/getHeaderToken";

const baseurl = process.env.REACT_APP_BASEURL;

export const getProfileDetails = createAsyncThunk('profile/get', async () => {
    try {
        let response = await axios.get(`${baseurl}/auth/profile`, await getHeaderToken());
        return response.data;
    }
    catch (error: any) {
        return error.response.data;
    }
})