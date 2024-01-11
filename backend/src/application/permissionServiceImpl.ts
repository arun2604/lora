import { Container, Service } from "typedi";
import { Logger } from "winston";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { IPermissionService } from "../context/permission/permissionService";
import { IPermissionRepository } from "../context/permission/permissionRepository";
import { PermissionMessage } from "../const/permission/permissionMessage";
import { BasePermission, BasePermissionSchema, PermissionId, PermissionIdSchema } from "../model/permission";
import { AuthDetails, BaseList } from "../model/baseModel";
import { getCurrentFormattedDateTime, getFormattedDateTime } from "../utilities/appUtils";

@Service(IPermissionService.identity)
export class PermissionServiceImpl extends IPermissionService {
  permissionRepository: IPermissionRepository = Container.get(IPermissionRepository.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getPermissions(): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getPermissions.name}`);
      const permissions = await this.permissionRepository.getPermissions();
      this.logger.info("Permission : " + JSON.stringify(permissions));
      if (!permissions) {
        return ApiResponse.conflict();
      }
      return ApiResponse.read(permissions, PermissionMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async getPermission(id: PermissionId): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getPermission.name}\nPermission id: ${JSON.stringify(id)}`);
      const validId = PermissionIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(PermissionMessage.getErrorMessage(validId.error.issues));
      }
      const permission = await this.permissionRepository.getPermission(id);
      this.logger.info("Permission : " + JSON.stringify(permission));
      if (!permission) {
        this.logger.info(PermissionMessage.failure.invalidId);
        return ApiResponse.badRequest(PermissionMessage.failure.invalidId);
      }
      return ApiResponse.read(permission, PermissionMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async createPermission(permissionDetails: BasePermission, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.createPermission.name}\nPermission Details : ${JSON.stringify(permissionDetails)}`,
      );
      const validPermission = BasePermissionSchema.safeParse(permissionDetails);
      if (!validPermission.success) {
        this.logger.info(JSON.stringify(validPermission.error));
        return ApiResponse.badRequest(PermissionMessage.getErrorMessage(validPermission.error.issues));
      }
      const validName = await this.permissionRepository.getPermissionByName(validPermission.data.name);
      if (validName) {
        this.logger.info(JSON.stringify(PermissionMessage.failure.duplicateName));
        return ApiResponse.badRequest(PermissionMessage.failure.duplicateName);
      }
      const baseDetails: BaseList = {
        isDeleted: 0,
        createdBy: authDetails.userId,
        createdOn: getCurrentFormattedDateTime(),
        updatedBy: null,
        updatedOn: null,
      };
      const newPermission = await this.permissionRepository.createPermission(validPermission.data, baseDetails);
      this.logger.info("New permission : " + JSON.stringify(newPermission));
      if (!newPermission) {
        return ApiResponse.conflict();
      }
      return ApiResponse.created(newPermission, PermissionMessage.success.created);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async updatePermission(
    id: PermissionId,
    permissionDetails: BasePermission,
    authDetails: AuthDetails,
  ): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.updatePermission.name}\nPermission id: ${JSON.stringify(
          id,
        )}\nPermission Details : ${JSON.stringify(permissionDetails)}`,
      );
      const validId = PermissionIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(PermissionMessage.getErrorMessage(validId.error.issues));
      }
      const validPermission = BasePermissionSchema.safeParse(permissionDetails);
      if (!validPermission.success) {
        this.logger.info(JSON.stringify(validPermission.error));
        return ApiResponse.badRequest(PermissionMessage.getErrorMessage(validPermission.error.issues));
      }
      const validName = await this.permissionRepository.getPermissionByName(validPermission.data.name, id);
      if (validName) {
        this.logger.info(JSON.stringify(PermissionMessage.failure.duplicateName));
        return ApiResponse.badRequest(PermissionMessage.failure.duplicateName);
      }
      const permission = await this.permissionRepository.getPermission(id);
      if (!permission) {
        this.logger.info(PermissionMessage.failure.invalidId);
        return ApiResponse.badRequest(PermissionMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: permission.isDeleted,
        createdBy: permission.createdBy,
        createdOn: getFormattedDateTime(new Date(permission.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const updatedPermission = await this.permissionRepository.updatePermission(id, validPermission.data, baseDetails);
      this.logger.info("Updated permission : " + JSON.stringify(updatedPermission));
      if (!updatedPermission) {
        this.logger.info(PermissionMessage.failure.invalidId);
        return ApiResponse.badRequest(PermissionMessage.failure.invalidId);
      }
      return ApiResponse.updated(updatedPermission, PermissionMessage.success.updated);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async deletePermission(id: PermissionId, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.deletePermission.name}\nPermission id: ${JSON.stringify(id)}`);
      const validId = PermissionIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(PermissionMessage.getErrorMessage(validId.error.issues));
      }
      const permissionDetails = await this.permissionRepository.getPermission(id);
      if (!permissionDetails) {
        this.logger.info(PermissionMessage.failure.invalidId);
        return ApiResponse.badRequest(PermissionMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: 1,
        createdBy: permissionDetails.createdBy,
        createdOn: getFormattedDateTime(new Date(permissionDetails.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const deletePermission = await this.permissionRepository.deletePermission(id, permissionDetails, baseDetails);
      if (!deletePermission) {
        this.logger.info(PermissionMessage.failure.invalidId);
        return ApiResponse.badRequest(PermissionMessage.failure.invalidId);
      }
      return ApiResponse.deleted(PermissionMessage.success.deleted);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }
}
