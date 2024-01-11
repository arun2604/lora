import { BaseUserRole, UserRole, UserRoleId } from "../../model/userRole";
import ApiResponse from "../../utilities/apiResponse";

export abstract class IUserRoleService {
  static identity: string = "IUserRoleService";

  abstract getUserRoles(): Promise<ApiResponse>;
  abstract getUserRole(id: UserRoleId): Promise<ApiResponse>;
  abstract createUserRole(userRoleDetails: UserRole, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract updateUserRole(id: UserRoleId, userRoleDetails: UserRole, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract deleteUserRole(id: UserRoleId, authDetails: Express.Locals): Promise<ApiResponse>;
}
