import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getHeaderToken } from "../utils/getHeaderToken";
import { DeviceModel } from "../../models/DeviceModel";

const baseurl = process.env.REACT_APP_BASEURL;

//get device details:-
export const getDeviceDetails = createAsyncThunk("device/get", async () => {
  try {
    let response = await axios.get(
      `${baseurl}/auth/device`,
      await getHeaderToken()
    );
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
});

//create device :-
export const createDevice = createAsyncThunk(
  "device/create",
  async (params: DeviceModel) => {
    try {
      let response = await axios.post(
        `${baseurl}/auth/device`,
        params,
        await getHeaderToken()
      );
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

// get by id device details :-
export const getByIdDeviceDetails = createAsyncThunk(
  "device/getByid",
  async (id: number) => {
    try {
      let response = await axios.get(
        `${baseurl}/auth/device/${id}`,
        await getHeaderToken()
      );
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

// update device :-
export const updateDevice = createAsyncThunk(
  "device/update",
  async (params: DeviceModel) => {
    try {
      let response = await axios.put(
        `${baseurl}/auth/device/${params.id}`,
        params,
        await getHeaderToken()
      );
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

// delete device :-
export const deleteDevice = createAsyncThunk(
  "device/delete",
  async (id: number) => {
    try {
      let response = await axios.delete(
        `${baseurl}/auth/device/${id}`,
        await getHeaderToken()
      );
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);
