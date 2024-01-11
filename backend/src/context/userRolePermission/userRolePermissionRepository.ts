import { BaseUserRolePermission, UserRolePermissionId, UserRolePermissionList } from "../../model/userRolePermission";
import { BaseList } from "../../model/baseModel";
import { UserRoleId } from "../../model/userRole";
import { PermissionId } from "../../model/permission";

export abstract class IUserRolePermissionRepository {
  static identity: string = "IUserRolePermissionRepository";

  abstract getUserRolePermissionsByUserRoleId(userRoleId: UserRoleId): Promise<UserRolePermissionList[] | undefined>;
  abstract getUserRolePermission(id: UserRolePermissionId): Promise<UserRolePermissionList | undefined>;
  abstract getUserRolePermissionByUserRoleIdAndPermissionId(
    userRoleId: UserRoleId,
    permissionId: PermissionId,
  ): Promise<UserRolePermissionList | undefined>;
  abstract createUserRolePermission(
    userRolePermissionDetails: BaseUserRolePermission,
    baseDetails: BaseList,
  ): Promise<string | undefined>;
  abstract deleteUserRolePermission(
    id: UserRolePermissionId,
    userRolePermissionDetails: BaseUserRolePermission,
    baseDetails: BaseList,
  ): Promise<string | undefined>;
}
