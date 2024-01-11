import { Logger } from "winston";
import { AppLogger } from "../../logger";
import { BasePermission, PermissionId } from "../../model/permission";
import { BaseList } from "../../model/baseModel";

export class PermissionQuery {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  tableName = "permission";
  permissionId = "permissionId";
  name = "Name";
  normalizedName = "NormalizedName";
  isDeleted = "IsDeleted";
  createdBy = "CreatedBy";
  createdOn = "CreatedOn";
  updatedBy = "UpdatedBy";
  updatedOn = "UpdatedOn";
  historyTableName = "permission_history";

  formattedName(name: string): string {
    let permissionName = name.replace("PERMISSION_", "").replace(/_/g, " ").toLowerCase();
    permissionName = permissionName[0].toUpperCase() + permissionName.slice(1);
    return permissionName;
  }

  findAll(): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.isDeleted} = false`;
    this.logger.info(`Find all permission query : ${query}`);
    return query;
  }
  findById(id: PermissionId): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.permissionId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Find permission by id query : ${query}`);
    return query;
  }
  findByName(name: string, id?: number) {
    const query = id
      ? `SELECT * FROM ${this.tableName} WHERE ${this.normalizedName} = '${name.toUpperCase()}' AND ${
          this.permissionId
        } != ${id} AND ${this.isDeleted} = false`
      : `SELECT * FROM ${this.tableName} WHERE ${this.normalizedName} = '${name.toUpperCase()}' AND ${
          this.isDeleted
        } = false`;
    this.logger.info(`Find permission by name query : ${query}`);
    return query;
  }
  create(permissionDetails: BasePermission, baseDetails: BaseList): string {
    const formattedName = this.formattedName(permissionDetails.name);
    const query = `INSERT INTO ${this.tableName} (${this.name}, ${this.normalizedName}, ${this.createdBy}, ${
      this.createdOn
    }) VALUES ('${formattedName}', '${permissionDetails.name.toUpperCase()}', '${baseDetails.createdBy}', '${
      baseDetails.createdOn
    }')`;
    this.logger.info(`Create permission query : ${query}`);
    return query;
  }
  update(id: PermissionId, permissionDetails: BasePermission, baseDetails: BaseList): string {
    const formattedName = this.formattedName(permissionDetails.name);
    const query = `UPDATE ${this.tableName} SET ${this.name} = '${formattedName}', ${
      this.normalizedName
    } = '${permissionDetails.name.toUpperCase()}', ${this.updatedBy} = '${baseDetails.updatedBy}', ${
      this.updatedOn
    } = '${baseDetails.updatedOn}' WHERE ${this.permissionId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Update permission query : ${query}`);
    return query;
  }
  delete(id: PermissionId, baseDetails: BaseList): string {
    const query = `UPDATE ${this.tableName} SET ${this.isDeleted} = ${baseDetails.isDeleted}, ${this.updatedBy} = '${baseDetails.updatedBy}', ${this.updatedOn} = '${baseDetails.updatedOn}' WHERE ${this.permissionId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Delete permission query : ${query}`);
    return query;
  }
  createHistory(id: PermissionId, permissionDetails: BasePermission, baseDetails: BaseList): string {
    const formattedName = this.formattedName(permissionDetails.name);
    let query = `INSERT INTO ${this.historyTableName} (${this.permissionId}, ${this.name}, ${this.normalizedName}, ${
      this.isDeleted
    }, ${this.createdBy}, ${this.createdOn}, ${this.updatedBy}, ${
      this.updatedOn
    }) VALUES (${id}, '${formattedName}', '${permissionDetails.name.toUpperCase()}', '${baseDetails.isDeleted}', ${
      baseDetails.createdBy
    }, '${baseDetails.createdOn}', ${baseDetails.updatedBy}, '${baseDetails.updatedOn}')`;
    if (baseDetails.updatedOn === null) {
      query = query.replace(/'null'/g, "null");
    }
    this.logger.info(`Create permission history query : ${query}`);
    return query;
  }
}
