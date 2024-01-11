import { createSlice } from "@reduxjs/toolkit";
import { DeviceListModel, DeviceModel } from "../../models/DeviceModel";
import {
  createDevice,
  deleteDevice,
  getByIdDeviceDetails,
  getDeviceDetails,
  updateDevice,
} from "../Thunks/DeviceThunks";

interface InitialState {
  isLoading: boolean;
  devices: DeviceListModel[];
  device: DeviceListModel;
  error: any;
}

let initialState: InitialState = {
  isLoading: false,
  devices: [],
  device: {} as DeviceListModel,
  error: null,
};

const deviceSlice = createSlice({
  name: "device",
  initialState: initialState,
  reducers: {},

  extraReducers: (builder) => {
    // get device details:-
    builder
      .addCase(getDeviceDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getDeviceDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.status) {
          state.devices = action.payload.data;
        }
      })
      .addCase(getDeviceDetails.rejected, (state, action) => {
        state.error = action.error;
      })

      // create device :-

      .addCase(createDevice.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get by id:-
      .addCase(getByIdDeviceDetails.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getByIdDeviceDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.status) {
          state.device = action.payload.data;
        }
      })
      .addCase(getByIdDeviceDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })

      // update device:-
      .addCase(updateDevice.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete device:-
      .addCase(deleteDevice.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const deviceReducer = deviceSlice.reducer;
