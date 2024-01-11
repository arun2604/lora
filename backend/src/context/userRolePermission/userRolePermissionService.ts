import { BaseUserRolePermission, UserRolePermissionId, UserRolePermissionList } from "../../model/userRolePermission";
import { UserRoleId } from "../../model/userRole";

export abstract class IUserRolePermissionService {
  static identity: string = "IUserRolePermissionService";

  abstract getUserRolePermissionsByUserRoleId(userRoleId: UserRoleId): Promise<UserRolePermissionList[] | undefined>;
  abstract createUserRolePermission(
    userRolePermissionDetails: BaseUserRolePermission,
    authDetails: Express.Locals,
  ): Promise<string | undefined>;
  abstract deleteUserRolePermission(id: UserRolePermissionId, authDetails: Express.Locals): Promise<string | undefined>;
}
