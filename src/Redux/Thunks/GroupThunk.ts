import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getHeaderToken } from "../utils/getHeaderToken";

const baseurl = process.env.REACT_APP_BASEURL;

export const getAllGroups = createAsyncThunk("groups/get", async () => {
    try {
        let response = await axios.get(
            `${baseurl}/auth/groups`,
            await getHeaderToken()
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
});

export const getGroupDetails = createAsyncThunk("groups/getDetails",
    async (id: number) => {
        try {
            let response = await axios.get(
                `${baseurl}/auth/groups/group-details/${id}`,
                await getHeaderToken()
            );
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    });

export const createGroup = createAsyncThunk(
    "group/create",
    async (params: any) => {
        try {
            let response = await axios.post(
                `${baseurl}/auth/groups`,
                params,
                await getHeaderToken()
            );
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
);

export const updateGroup = createAsyncThunk(
    "group/update",
    async (params: any) => {
        try {
            let response = await axios.put(
                `${baseurl}/auth/groups/${params.id}`,
                params.name,
                await getHeaderToken()
            );
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
);


export const updateGroupDetails = createAsyncThunk(
    "group/updateDetails",
    async (params: any) => {
        try {
            let response = await axios.put(
                `${baseurl}/auth/groups/group-details/${params.id}`,
                params.details,
                await getHeaderToken()
            );
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
);

export const deleteGroups = createAsyncThunk("groups/delete", async (id: number) => {
    try {
        let response = await axios.delete(
            `${baseurl}/auth/groups/${id}`,
            await getHeaderToken()
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
});