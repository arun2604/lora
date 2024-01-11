import { combineReducers } from "@reduxjs/toolkit";
import { loginReducer } from "./Slices/LoginSlice";
import { deviceReducer } from "./Slices/DeviceSlice";
import { profileReducer } from "./Slices/ProfileSlice";
import { groupReducer } from "./Slices/GroupSlice";
import { groupMemberReducer } from "./Slices/GroupmemberSlice";

export default combineReducers({
  login: loginReducer,
  device: deviceReducer,
  profile: profileReducer,
  groups: groupReducer,
  groupMembers: groupMemberReducer,
});
