import { Logger } from "winston";
import { AppLogger } from "../../logger";
import { BaseUserRole, UserRoleId } from "../../model/userRole";
import { BaseList } from "../../model/baseModel";

export class UserRoleQuery {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  tableName = "user_role";
  userRoleId = "UserRoleId";
  name = "Name";
  normalizedName = "NormalizedName";
  isDeleted = "IsDeleted";
  createdBy = "CreatedBy";
  createdOn = "CreatedOn";
  updatedBy = "UpdatedBy";
  updatedOn = "UpdatedOn";
  historyTableName = "user_role_history";

  findAll(): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.isDeleted} = false`;
    this.logger.info(`Find all user role query : ${query}`);
    return query;
  }
  findById(id: UserRoleId): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.userRoleId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Find user role by id query : ${query}`);
    return query;
  }
  findByName(name: string, id?: number) {
    const query = id
      ? `SELECT * FROM ${this.tableName} WHERE ${this.normalizedName} = '${name.toUpperCase()}' AND ${
          this.userRoleId
        } != ${id} AND ${this.isDeleted} = false`
      : `SELECT * FROM ${this.tableName} WHERE ${this.normalizedName} = '${name.toUpperCase()}' AND ${
          this.isDeleted
        } = false`;
    this.logger.info(`Find user role by name query : ${query}`);
    return query;
  }
  create(userRoleDetails: BaseUserRole, baseDetails: BaseList): string {
    const query = `INSERT INTO ${this.tableName} (${this.name}, ${this.normalizedName}, ${this.createdBy}, ${
      this.createdOn
    }) VALUES ('${userRoleDetails.name}', '${userRoleDetails.name.toUpperCase()}', '${baseDetails.createdBy}', '${
      baseDetails.createdOn
    }')`;
    this.logger.info(`Create user role query : ${query}`);
    return query;
  }
  update(id: UserRoleId, userRoleDetails: BaseUserRole, baseDetails: BaseList): string {
    const query = `UPDATE ${this.tableName} SET ${this.name} = '${userRoleDetails.name}', ${
      this.normalizedName
    } = '${userRoleDetails.name.toUpperCase()}', ${this.updatedBy} = '${baseDetails.updatedBy}', ${this.updatedOn} = '${
      baseDetails.updatedOn
    }' WHERE ${this.userRoleId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Update user role query : ${query}`);
    return query;
  }
  delete(id: UserRoleId, baseDetails: BaseList): string {
    const query = `UPDATE ${this.tableName} SET ${this.isDeleted} = ${baseDetails.isDeleted}, ${this.updatedBy} = '${baseDetails.updatedBy}', ${this.updatedOn} = '${baseDetails.updatedOn}' WHERE ${this.userRoleId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Delete user role query : ${query}`);
    return query;
  }
  createHistory(id: UserRoleId, userRoleDetails: BaseUserRole, baseDetails: BaseList): string {
    let query = `INSERT INTO ${this.historyTableName} (${this.userRoleId}, ${this.name}, ${this.normalizedName}, ${
      this.isDeleted
    }, ${this.createdBy}, ${this.createdOn}, ${this.updatedBy}, ${this.updatedOn}) VALUES (${id}, '${
      userRoleDetails.name
    }', '${userRoleDetails.name.toUpperCase()}', '${baseDetails.isDeleted}', ${baseDetails.createdBy}, '${
      baseDetails.createdOn
    }', ${baseDetails.updatedBy}, '${baseDetails.updatedOn}')`;
    if (baseDetails.updatedOn === null) {
      query = query.replace(/'null'/g, "null");
    }
    this.logger.info(`Create user role history query : ${query}`);
    return query;
  }
}
