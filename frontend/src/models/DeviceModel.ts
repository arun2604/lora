export interface DeviceModel {
    id:number;
    name: string;
    APIKey:string;
}

export interface DeviceListModel {
    deviceId: number;
    companyId: number;
    name: string;
    normalizedName: string;
    APIKey: string;
    isDeleted: boolean | 0 | 1;
    createdBy: number;
    createdOn: string;
    updatedBy: number | null;
    updatedOn: string | null;
    companyName: string;
    companyNormalizedName: string;
}