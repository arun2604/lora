import { Logger } from "winston";
import { AppLogger } from "../../logger";
import { BaseList } from "../../model/baseModel";
import { BaseUserRolePermission, UserRolePermissionId } from "../../model/userRolePermission";
import { UserRoleId } from "../../model/userRole";
import { PermissionId } from "../../model/permission";

export class UserRolePermissionQuery {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  tableName = "user_role_permission";
  userRolePermissionId = "UserRolePermissionId";
  userRoleId = "UserRoleId";
  permissionId = "PermissionId";
  isDeleted = "IsDeleted";
  createdBy = "CreatedBy";
  createdOn = "CreatedOn";
  updatedBy = "UpdatedBy";
  updatedOn = "UpdatedOn";
  historyTableName = "user_role_permission_history";

  findAllByUserRoleId(userRoleId: UserRoleId): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.userRoleId} = ${userRoleId} AND ${this.isDeleted} = false`;
    this.logger.info(`Find all user role permission query : ${query}`);
    return query;
  }
  findByUserRolePermissionId(id: UserRolePermissionId): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.userRolePermissionId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Find user role permission id query : ${query}`);
    return query;
  }
  findByUserRoleIdAndPermissionId(userRoleId: UserRoleId, permissionId: PermissionId): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.userRoleId} = ${userRoleId} AND ${this.permissionId} = ${permissionId} AND ${this.isDeleted} = false`;
    this.logger.info(`Find user role permission query : ${query}`);
    return query;
  }
  create(userRolePermissionDetails: BaseUserRolePermission, baseDetails: BaseList): string {
    const query = `INSERT INTO ${this.tableName} (${this.userRoleId}, ${this.permissionId}, ${this.createdBy}, ${this.createdOn}) VALUES (${userRolePermissionDetails.userRoleId}, ${userRolePermissionDetails.permissionId}, '${baseDetails.createdBy}', '${baseDetails.createdOn}')`;
    this.logger.info(`Create user role permission query : ${query}`);
    return query;
  }
  delete(id: UserRolePermissionId, baseDetails: BaseList): string {
    const query = `UPDATE ${this.tableName} SET ${this.isDeleted} = ${baseDetails.isDeleted}, ${this.updatedBy} = '${baseDetails.updatedBy}', ${this.updatedOn} = '${baseDetails.updatedOn}' WHERE ${this.userRolePermissionId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Delete user role query : ${query}`);
    return query;
  }
  createHistory(
    id: UserRolePermissionId,
    userRolePermissionDetails: BaseUserRolePermission,
    baseDetails: BaseList,
  ): string {
    let query = `INSERT INTO ${this.historyTableName} (${this.userRolePermissionId}, ${this.userRoleId}, ${this.permissionId}, ${this.isDeleted}, ${this.createdBy}, ${this.createdOn}, ${this.updatedBy}, ${this.updatedOn}) VALUES (${id}, ${userRolePermissionDetails.userRoleId}, ${userRolePermissionDetails.permissionId}, ${baseDetails.isDeleted}, ${baseDetails.createdBy}, '${baseDetails.createdOn}', ${baseDetails.updatedBy}, '${baseDetails.updatedOn}')`;
    if (baseDetails.updatedOn === null) {
      query = query.replace(/'null'/g, "null");
    }
    this.logger.info(`Create user role permission history query : ${query}`);
    return query;
  }
}
