import { Container, Service } from "typedi";
import { Logger } from "winston";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { IUserRoleService } from "../context/userRole/userRoleService";
import { IUserRoleRepository } from "../context/userRole/userRoleRepository";
import { UserRoleMessage } from "../const/userRole/userRoleMessage";
import { UserRole, UserRoleId, UserRoleIdSchema, UserRoleSchema } from "../model/userRole";
import { AuthDetails, BaseList } from "../model/baseModel";
import { getCurrentFormattedDateTime, getFormattedDateTime } from "../utilities/appUtils";
import { IUserRolePermissionRepository } from "../context/userRolePermission/userRolePermissionRepository";
import { IPermissionRepository } from "../context/permission/permissionRepository";

@Service(IUserRoleService.identity)
export class UserRoleServiceImpl extends IUserRoleService {
  userRoleRepository: IUserRoleRepository = Container.get(IUserRoleRepository.identity);
  permissionRepository: IPermissionRepository = Container.get(IPermissionRepository.identity);
  userRolePermissionRepository: IUserRolePermissionRepository = Container.get(IUserRolePermissionRepository.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getUserRoles(): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getUserRoles.name}`);
      const userRoles = await this.userRoleRepository.getUserRoles();
      this.logger.info("User role : " + JSON.stringify(userRoles));
      if (!userRoles) {
        return ApiResponse.conflict();
      }
      return ApiResponse.read(userRoles, UserRoleMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async getUserRole(id: UserRoleId): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getUserRole.name}\nUserRole id: ${JSON.stringify(id)}`);
      const validId = UserRoleIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(UserRoleMessage.getErrorMessage(validId.error.issues));
      }
      const userRole = await this.userRoleRepository.getUserRole(id);
      this.logger.info("UserRole : " + JSON.stringify(userRole));
      if (!userRole) {
        this.logger.info(UserRoleMessage.failure.invalidId);
        return ApiResponse.badRequest(UserRoleMessage.failure.invalidId);
      }
      return ApiResponse.read(userRole, UserRoleMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async createUserRole(userRoleDetails: UserRole, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.createUserRole.name}\nUserRole Details : ${JSON.stringify(userRoleDetails)}`);
      const validUserRole = UserRoleSchema.safeParse(userRoleDetails);
      if (!validUserRole.success) {
        this.logger.info(JSON.stringify(validUserRole.error));
        return ApiResponse.badRequest(UserRoleMessage.getErrorMessage(validUserRole.error.issues));
      }
      const validName = await this.userRoleRepository.getUserRoleByName(validUserRole.data.name);
      if (validName) {
        this.logger.info(JSON.stringify(UserRoleMessage.failure.duplicateName));
        return ApiResponse.badRequest(UserRoleMessage.failure.duplicateName);
      }
      const baseDetails: BaseList = {
        isDeleted: 0,
        createdBy: authDetails.userId,
        createdOn: getCurrentFormattedDateTime(),
        updatedBy: null,
        updatedOn: null,
      };
      const newUserRole = await this.userRoleRepository.createUserRole(validUserRole.data, baseDetails);
      this.logger.info("New userRole : " + JSON.stringify(newUserRole));
      if (!newUserRole) {
        return ApiResponse.conflict();
      }
      for (const eachPermission of validUserRole.data.permissions) {
        const permission = await this.permissionRepository.getPermission(eachPermission.permissionId);
        if (!permission) {
          return ApiResponse.badRequest("Permission id not found");
        }
        const createUserRolePermission = await this.userRolePermissionRepository.createUserRolePermission(
          { userRoleId: newUserRole.userRoleId, permissionId: eachPermission.permissionId },
          baseDetails,
        );
        if (!createUserRolePermission) {
          return ApiResponse.conflict();
        }
      }
      this.logger.info("New userRole : " + JSON.stringify(newUserRole));
      if (!newUserRole) {
        return ApiResponse.conflict();
      }
      return ApiResponse.created(newUserRole, UserRoleMessage.success.created);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async updateUserRole(id: UserRoleId, userRoleDetails: UserRole, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.updateUserRole.name}\nUserRole id: ${JSON.stringify(id)}\nUserRole Details : ${JSON.stringify(
          userRoleDetails,
        )}`,
      );
      const validId = UserRoleIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(UserRoleMessage.getErrorMessage(validId.error.issues));
      }
      const validUserRole = UserRoleSchema.safeParse(userRoleDetails);
      if (!validUserRole.success) {
        this.logger.info(JSON.stringify(validUserRole.error));
        return ApiResponse.badRequest(UserRoleMessage.getErrorMessage(validUserRole.error.issues));
      }
      const validName = await this.userRoleRepository.getUserRoleByName(validUserRole.data.name, id);
      if (validName) {
        this.logger.info(JSON.stringify(UserRoleMessage.failure.duplicateName));
        return ApiResponse.badRequest(UserRoleMessage.failure.duplicateName);
      }
      const userRole = await this.userRoleRepository.getUserRole(id);
      if (!userRole) {
        this.logger.info(UserRoleMessage.failure.invalidId);
        return ApiResponse.badRequest(UserRoleMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: userRole.isDeleted,
        createdBy: userRole.createdBy,
        createdOn: getFormattedDateTime(new Date(userRole.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const updatedUserRole = await this.userRoleRepository.updateUserRole(id, validUserRole.data, baseDetails);
      this.logger.info("Updated userRole : " + JSON.stringify(updatedUserRole));
      if (!updatedUserRole) {
        this.logger.info(UserRoleMessage.failure.invalidId);
        return ApiResponse.badRequest(UserRoleMessage.failure.invalidId);
      }
      for (const eachPermission of validUserRole.data.permissions) {
        if (eachPermission.isDeleted === true || eachPermission.isDeleted === 1) {
          const validUserRolePermission =
            await this.userRolePermissionRepository.getUserRolePermissionByUserRoleIdAndPermissionId(
              id,
              eachPermission.permissionId,
            );
          if (!validUserRolePermission) {
            this.logger.info("User role id and permission id didn't match");
            return ApiResponse.badRequest("User role id and permission id didn't match");
          }
          const deleteUserRolePermission = await this.userRolePermissionRepository.deleteUserRolePermission(
            validUserRolePermission.userRolePermissionId,
            validUserRolePermission,
            { ...baseDetails, isDeleted: 1 },
          );
          if (!deleteUserRolePermission) {
            this.logger.info("Invalid user role permission id");
            return ApiResponse.badRequest("Invalid user role permission id");
          }
          this.logger.info("User role permission deleted successfully");
        } else {
          const validUserRolePermission =
            await this.userRolePermissionRepository.getUserRolePermissionByUserRoleIdAndPermissionId(
              id,
              eachPermission.permissionId,
            );
          if (!validUserRolePermission) {
            const permission = await this.permissionRepository.getPermission(eachPermission.permissionId);
            if (!permission) {
              return ApiResponse.badRequest("Permission id not found");
            }
            const createUserRolePermission = await this.userRolePermissionRepository.createUserRolePermission(
              { userRoleId: id, permissionId: eachPermission.permissionId },
              baseDetails,
            );
            if (!createUserRolePermission) {
              return ApiResponse.conflict();
            }
          }
        }
      }
      return ApiResponse.updated(updatedUserRole, UserRoleMessage.success.updated);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async deleteUserRole(id: UserRoleId, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.deleteUserRole.name}\nUserRole id: ${JSON.stringify(id)}`);
      const validId = UserRoleIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(UserRoleMessage.getErrorMessage(validId.error.issues));
      }
      const userRoleDetails = await this.userRoleRepository.getUserRole(id);
      if (!userRoleDetails) {
        this.logger.info(UserRoleMessage.failure.invalidId);
        return ApiResponse.badRequest(UserRoleMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: 1,
        createdBy: userRoleDetails.createdBy,
        createdOn: getFormattedDateTime(new Date(userRoleDetails.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const deleteUserRole = await this.userRoleRepository.deleteUserRole(id, userRoleDetails, baseDetails);
      if (!deleteUserRole) {
        this.logger.info(UserRoleMessage.failure.invalidId);
        return ApiResponse.badRequest(UserRoleMessage.failure.invalidId);
      }
      return ApiResponse.deleted(UserRoleMessage.success.deleted);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }
}
