import { GroupsModel, GroupModel } from "../models/GroupsModel";

export interface GroupInitialState {
    isLoading: boolean;
    groups: GroupsModel[] | any;
    groupAllDetail: any;
    selectedDevices: [];
    group: GroupsModel | object;
    error: any;
}