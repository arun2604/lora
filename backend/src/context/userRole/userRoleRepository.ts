import { BaseUserRole, UserRoleId, UserRoleList } from "../../model/userRole";
import { BaseList } from "../../model/baseModel";

export abstract class IUserRoleRepository {
  static identity: string = "IUserRoleRepository";

  abstract getUserRoles(): Promise<UserRoleList[] | undefined>;
  abstract getUserRole(id: UserRoleId): Promise<UserRoleList | undefined>;
  abstract getUserRoleByName(name: string, id?: number): Promise<UserRoleList | undefined>;
  abstract createUserRole(userRoleDetails: BaseUserRole, baseDetails: BaseList): Promise<UserRoleList | undefined>;
  abstract updateUserRole(
    id: UserRoleId,
    userRoleDetails: BaseUserRole,
    baseDetails: BaseList,
  ): Promise<UserRoleList | undefined>;
  abstract deleteUserRole(
    id: UserRoleId,
    userRoleDetails: BaseUserRole,
    baseDetails: BaseList,
  ): Promise<string | undefined>;
}
