import { createSlice } from "@reduxjs/toolkit";
import { getGroupDetails, getAllGroups, updateGroup, createGroup, updateGroupDetails, deleteGroups } from '../Thunks/GroupThunk'
import { GroupInitialState } from '../../types/Groups'

let initialState: GroupInitialState = {
    isLoading: false,
    groups: [],
    groupAllDetail: [],
    group: {},
    selectedDevices: [],
    error: '',
}

const GroupSlice = createSlice({
    name: 'Groups',
    initialState,
    reducers: {
        getSelectedDevices: (state: any) => {
            let existingDevices: any = [];
            state.groupAllDetail.memberDetails.map((member: any) => {
                existingDevices.push(member.deviceId)
            });
            state.selectedDevices = existingDevices
            state.isChanged = true
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllGroups.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.status) {
                state.groups = action.payload.data
            }
        })
        builder.addCase(getAllGroups.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getAllGroups.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(getGroupDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.status) {
                state.groupAllDetail = action.payload.data
            }
        })
        builder.addCase(getGroupDetails.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getGroupDetails.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(updateGroup.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(updateGroup.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(updateGroup.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(createGroup.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(createGroup.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(createGroup.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(updateGroupDetails.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(updateGroupDetails.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(updateGroupDetails.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(deleteGroups.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(deleteGroups.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(deleteGroups.rejected, (state) => {
            state.isLoading = false;
        })
    }
})

export const { getSelectedDevices } = GroupSlice.actions

export const groupReducer = GroupSlice.reducer;