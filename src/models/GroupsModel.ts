export interface GroupModel {
    id: number;
    name: string;
}

export interface GroupsModel {
    groupId: number;
    name: string;
    normalizedName: string;
    companyId: number;
    isDeleted: boolean | 0 | 1;
    createdBy: number;
    createdOn: string;
    updatedBy: number | null;
    updatedOn: string;
}