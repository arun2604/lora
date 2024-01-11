import { BaseList } from "./baseModel";

export type BaseUserRolePermission = {
  userRoleId: number;
  permissionId: number;
};

export type UserRolePermissionId = number;

export type UserRolePermissionList = {
  userRolePermissionId: number;
  userRoleId: number;
  permissionId: number;
  isDeleted: boolean | 0 | 1;
  createdBy: number;
  createdOn: string;
  updatedBy: number | null;
  updatedOn: string | null;
};
