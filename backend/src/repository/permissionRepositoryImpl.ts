import Container, { Service } from "typedi";
import { RowDataPacket } from "mysql2";
import { Logger } from "winston";
import { IDatabaseManager } from "../context/database/databaseManager";
import { IPermissionRepository } from "../context/permission/permissionRepository";
import { BasePermission, PermissionId, PermissionList } from "../model/permission";
import { AppLogger } from "../logger";
import { PermissionQuery } from "../const/permission/permissionQuery";
import { BaseList } from "../model/baseModel";

@Service(IPermissionRepository.identity)
export class PermissionRepositoryImpl extends IPermissionRepository {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  permissionQuery = new PermissionQuery();

  async getPermissions(): Promise<PermissionList[] | undefined> {
    this.logger.info(`Method : ${this.getPermissions.name}`);
    const permissions = await this.database.executeGetQuery<PermissionList>(this.permissionQuery.findAll());
    this.logger.info("Permission : " + JSON.stringify(permissions));
    if (permissions !== undefined) {
      return permissions;
    }
  }

  async getPermission(id: PermissionId): Promise<PermissionList | undefined> {
    this.logger.info(`Method : ${this.getPermission.name}\nPermission id: ${JSON.stringify(id)}`);
    const [permission] = await this.database.executeGetQuery<PermissionList>(this.permissionQuery.findById(id));
    this.logger.info("Permission : " + JSON.stringify(permission));
    return permission;
  }

  async getPermissionByName(name: string, id?: number): Promise<PermissionList | undefined> {
    this.logger.info(
      `Method : ${this.getPermissionByName.name}\nPermission name: ${JSON.stringify(name)}${
        id ? `\nPermission id: ${JSON.stringify(id)}` : ""
      }`,
    );
    const [permission] = await this.database.executeGetQuery<PermissionList>(this.permissionQuery.findByName(name, id));
    this.logger.info("Permission : " + JSON.stringify(permission));
    return permission;
  }

  async createPermission(
    permissionDetails: BasePermission,
    baseDetails: BaseList,
  ): Promise<PermissionList | undefined> {
    this.logger.info(
      `Method : ${this.createPermission.name}\nPermission details: ${JSON.stringify(permissionDetails)}`,
    );
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(this.permissionQuery.create(permissionDetails, baseDetails));
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.insertId <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(
      this.permissionQuery.createHistory(result.insertId, permissionDetails, baseDetails),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    const newPermission = await this.getPermission(result.insertId);
    this.logger.info(`New permission: ${JSON.stringify(newPermission)}`);
    return newPermission;
  }

  async updatePermission(
    id: PermissionId,
    permissionDetails: PermissionList,
    baseDetails: BaseList,
  ): Promise<PermissionList | undefined> {
    this.logger.info(
      `Method : ${this.updatePermission.name}\nPermission id: ${JSON.stringify(
        id,
      )}\nPermission details: ${JSON.stringify(permissionDetails)}`,
    );
    await this.database.executeStartTransactionQuery();
    const permission = await this.getPermission(id);
    if (!permission) {
      return permission;
    }
    const result = await this.database.executeRunQuery(this.permissionQuery.update(id, permissionDetails, baseDetails));
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(
      this.permissionQuery.createHistory(id, permissionDetails, baseDetails),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    const updatedPermission = await this.getPermission(id);
    this.logger.info(`Updated permission: ${JSON.stringify(updatedPermission)}`);
    return updatedPermission;
  }

  async deletePermission(
    id: PermissionId,
    permissionDetails: BasePermission,
    baseDetails: BaseList,
  ): Promise<string | undefined> {
    this.logger.info(`Method : ${this.deletePermission.name}\nPermission id: ${JSON.stringify(id)}`);
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(this.permissionQuery.delete(id, baseDetails));
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(
      this.permissionQuery.createHistory(id, permissionDetails, baseDetails),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    return "Permission deleted successfully";
  }
}
