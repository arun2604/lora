import { createSlice } from "@reduxjs/toolkit";
import { getProfileDetails } from "../Thunks/ProfileThunk";
import { ProfileModel } from "../../models/ProfileModel";

let initialState = {
  isLoading: false,
  profile: {} as ProfileModel,
  error: {},
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProfileDetails.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.profile = action.payload.data;
        }
      })
      .addCase(getProfileDetails.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

export const profileReducer = profileSlice.reducer;
