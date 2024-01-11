import Container, { Service } from "typedi";
import { RowDataPacket } from "mysql2";
import { Logger } from "winston";
import { IDatabaseManager } from "../context/database/databaseManager";
import { IUserRolePermissionRepository } from "../context/userRolePermission/userRolePermissionRepository";
import { BaseUserRolePermission, UserRolePermissionId, UserRolePermissionList } from "../model/userRolePermission";
import { AppLogger } from "../logger";
import { UserRolePermissionQuery } from "../const/userRolePermission/userRolePermissionQuery";
import { BaseList } from "../model/baseModel";
import { UserRoleId } from "../model/userRole";

@Service(IUserRolePermissionRepository.identity)
export class UserRolePermissionRepositoryImpl extends IUserRolePermissionRepository {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  userRolePermissionQuery = new UserRolePermissionQuery();

  async getUserRolePermissionsByUserRoleId(userRoleId: UserRoleId): Promise<UserRolePermissionList[] | undefined> {
    this.logger.info(
      `Method : ${this.getUserRolePermissionsByUserRoleId.name}\nUser role id : ${JSON.stringify(userRoleId)}`,
    );
    const userRolePermissions = await this.database.executeGetQuery<UserRolePermissionList>(this.userRolePermissionQuery.findAllByUserRoleId(userRoleId));
    this.logger.info("User role permission : " + JSON.stringify(userRolePermissions));
    if (userRolePermissions !== undefined) {
      return userRolePermissions;
    }
  }

  async getUserRolePermission(id: UserRolePermissionId): Promise<UserRolePermissionList | undefined> {
    this.logger.info(
      `Method : ${this.getUserRolePermissionsByUserRoleId.name}\nUser role permission id : ${JSON.stringify(id)}`,
    );
    const [userRolePermission] = await this.database.executeGetQuery<UserRolePermissionList>(this.userRolePermissionQuery.findByUserRolePermissionId(id));
    this.logger.info("User role permission : " + JSON.stringify(userRolePermission));
    if (userRolePermission !== undefined) {
      return userRolePermission;
    }
  }

  async getUserRolePermissionByUserRoleIdAndPermissionId(
    userRoleId: number,
    permissionId: number,
  ): Promise<UserRolePermissionList | undefined> {
    this.logger.info(
      `Method : ${this.getUserRolePermissionsByUserRoleId.name}\nUser role id : ${JSON.stringify(
        userRoleId,
      )}\nPermission id : ${JSON.stringify(permissionId)}`,
    );
    const [userRolePermission] = await this.database.executeGetQuery<UserRolePermissionList>(
      this.userRolePermissionQuery.findByUserRoleIdAndPermissionId(userRoleId, permissionId),
    );
    this.logger.info("User role permission : " + JSON.stringify(userRolePermission));
    if (userRolePermission !== undefined) {
      return userRolePermission;
    }
  }

  async createUserRolePermission(
    userRolePermissionDetails: BaseUserRolePermission,
    baseDetails: BaseList,
  ): Promise<string | undefined> {
    this.logger.info(
      `Method : ${this.createUserRolePermission.name}\nUser role permission details: ${JSON.stringify(
        userRolePermissionDetails,
      )}`,
    );
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(
      this.userRolePermissionQuery.create(userRolePermissionDetails, baseDetails),
    );
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.insertId <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(
      this.userRolePermissionQuery.createHistory(result.insertId, userRolePermissionDetails, baseDetails),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    return "Created user role permission";
  }

  async deleteUserRolePermission(
    id: UserRolePermissionId,
    userRolePermissionDetails: BaseUserRolePermission,
    baseDetails: BaseList,
  ): Promise<string | undefined> {
    this.logger.info(`Method : ${this.deleteUserRolePermission.name}\nUser role permission id: ${JSON.stringify(id)}`);
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(this.userRolePermissionQuery.delete(id, baseDetails));
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(
      this.userRolePermissionQuery.createHistory(id, userRolePermissionDetails, baseDetails),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    return "User role permission deleted successfully";
  }
}
