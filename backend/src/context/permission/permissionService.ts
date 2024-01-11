import { BasePermission, PermissionId } from "../../model/permission";
import ApiResponse from "../../utilities/apiResponse";

export abstract class IPermissionService {
  static identity: string = "IPermissionService";

  abstract getPermissions(): Promise<ApiResponse>;
  abstract getPermission(id: PermissionId): Promise<ApiResponse>;
  abstract createPermission(permissionDetails: BasePermission, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract updatePermission(
    id: PermissionId,
    permissionDetails: BasePermission,
    authDetails: Express.Locals,
  ): Promise<ApiResponse>;
  abstract deletePermission(id: PermissionId, authDetails: Express.Locals): Promise<ApiResponse>;
}
