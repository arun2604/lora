import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getHeaderToken } from "../utils/getHeaderToken";

const baseurl = process.env.REACT_APP_BASEURL;

export const deleteGroupMember = createAsyncThunk("groups-member/delete",
    async (id: number) => {
        try {
            let response = await axios.delete(
                `${baseurl}/auth/group-members/${id}`,
                await getHeaderToken()
            );
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    });

export const getGroupMemberNotInGroup = createAsyncThunk("groups-member/gteNotInGroup",
    async (id: number) => {
        try {
            let response = await axios.get(
                `${baseurl}/auth/group-members/group/${id}`,
                await getHeaderToken()
            );
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    });

export const createMultipleGroupMembers = createAsyncThunk(
    "groups-member/create-multiple",
    async (params: any) => {
        try {
            let response = await axios.post(
                `${baseurl}/auth/group-members/multiple`,
                params,
                await getHeaderToken()
            );
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
);