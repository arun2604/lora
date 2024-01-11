import { createSlice } from "@reduxjs/toolkit";
import { createMultipleGroupMembers, deleteGroupMember, getGroupMemberNotInGroup } from "../Thunks/GroupMemberthunk";

let initialState = {
    isLoading: false,
    groupMembers: [],
    groupmember: {},
    error: '',
}

const GroupMemberSlice = createSlice({
    name: 'Groups',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getGroupMemberNotInGroup.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.status) {
                state.groupMembers = action.payload.data
            }
        })
        builder.addCase(getGroupMemberNotInGroup.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getGroupMemberNotInGroup.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(deleteGroupMember.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(deleteGroupMember.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(deleteGroupMember.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(createMultipleGroupMembers.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(createMultipleGroupMembers.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(createMultipleGroupMembers.rejected, (state) => {
            state.isLoading = false;
        })
    }
})

export const groupMemberReducer = GroupMemberSlice.reducer;