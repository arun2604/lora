import { BasePermission, PermissionId, PermissionList } from "../../model/permission";
import { BaseList } from "../../model/baseModel";

export abstract class IPermissionRepository {
  static identity: string = "IPermissionRepository";

  abstract getPermissions(): Promise<PermissionList[] | undefined>;
  abstract getPermission(id: PermissionId): Promise<PermissionList | undefined>;
  abstract getPermissionByName(name: string, id?: number): Promise<PermissionList | undefined>;
  abstract createPermission(
    permissionDetails: BasePermission,
    baseDetails: BaseList,
  ): Promise<PermissionList | undefined>;
  abstract updatePermission(
    id: PermissionId,
    permissionDetails: BasePermission,
    baseDetails: BaseList,
  ): Promise<PermissionList | undefined>;
  abstract deletePermission(
    id: PermissionId,
    permissionDetails: BasePermission,
    baseDetails: BaseList,
  ): Promise<string | undefined>;
}
