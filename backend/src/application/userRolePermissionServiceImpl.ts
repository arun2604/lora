import { Container, Service } from "typedi";
import { Logger } from "winston";
import { AppLogger } from "../logger";
import { IUserRolePermissionService } from "../context/userRolePermission/userRolePermissionService";
import { IUserRolePermissionRepository } from "../context/userRolePermission/userRolePermissionRepository";
import { BaseUserRolePermission, UserRolePermissionId, UserRolePermissionList } from "../model/userRolePermission";
import { AuthDetails, BaseList } from "../model/baseModel";
import { getCurrentFormattedDateTime, getFormattedDateTime } from "../utilities/appUtils";
import { UserRoleId } from "../model/userRole";

@Service(IUserRolePermissionService.identity)
export class UserRolePermissionServiceImpl extends IUserRolePermissionService {
  userRolePermissionRepository: IUserRolePermissionRepository = Container.get(IUserRolePermissionRepository.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getUserRolePermissionsByUserRoleId(userRoleId: UserRoleId): Promise<UserRolePermissionList[] | undefined> {
    try {
      this.logger.info(`Method : ${this.getUserRolePermissionsByUserRoleId.name}`);
      const userRolePermissions =
        await this.userRolePermissionRepository.getUserRolePermissionsByUserRoleId(userRoleId);
      this.logger.info("User role : " + JSON.stringify(userRolePermissions));
      if (!userRolePermissions) {
        return;
      }
      return userRolePermissions;
    } catch (error) {
      this.logger.error(`${error}`);
      return;
    }
  }

  async createUserRolePermission(
    userRolePermissionDetails: BaseUserRolePermission,
    authDetails: AuthDetails,
  ): Promise<string | undefined> {
    try {
      this.logger.info(
        `Method : ${this.createUserRolePermission.name}\nUserRolePermission Details : ${JSON.stringify(
          userRolePermissionDetails,
        )}`,
      );
      const baseDetails: BaseList = {
        isDeleted: 0,
        createdBy: authDetails.userId,
        createdOn: getCurrentFormattedDateTime(),
        updatedBy: null,
        updatedOn: null,
      };
      const newUserRolePermission = await this.userRolePermissionRepository.createUserRolePermission(
        userRolePermissionDetails,
        baseDetails,
      );
      this.logger.info("New userRolePermission : " + JSON.stringify(newUserRolePermission));
      if (!newUserRolePermission) {
        return;
      }
      return newUserRolePermission;
    } catch (error) {
      this.logger.error(`${error}`);
      return;
    }
  }

  async deleteUserRolePermission(id: UserRolePermissionId, authDetails: AuthDetails): Promise<string | undefined> {
    try {
      this.logger.info(`Method : ${this.deleteUserRolePermission.name}\nUserRolePermission id: ${JSON.stringify(id)}`);
      const userRolePermissionDetails = await this.userRolePermissionRepository.getUserRolePermission(id);
      if (!userRolePermissionDetails) {
        return;
      }
      const baseDetails: BaseList = {
        isDeleted: 1,
        createdBy: userRolePermissionDetails.createdBy,
        createdOn: getFormattedDateTime(new Date(userRolePermissionDetails.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const deleteUserRolePermission = await this.userRolePermissionRepository.deleteUserRolePermission(
        id,
        userRolePermissionDetails,
        baseDetails,
      );
      if (!deleteUserRolePermission) {
        return;
      }
      return "Deleted successfully";
    } catch (error) {
      this.logger.error(`${error}`);
      return;
    }
  }
}
