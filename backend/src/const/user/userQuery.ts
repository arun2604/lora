import { Logger } from "winston";
import { AppLogger } from "../../logger";
import { BaseUser, User, UserId } from "../../model/user";
import { BaseList } from "../../model/baseModel";

export class UserQuery {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  tableName = "user";
  userId = "UserId";
  companyId = "CompanyId";
  userRoleId = "UserRoleId";
  name = "Name";
  normalizedName = "NormalizedName";
  email = "Email";
  normalizedEmail = "NormalizedEmail";
  isEmailConfirmed = "IsEmailConfirmed";
  password = "PasswordHash";
  mobileNumber = "MobileNumber";
  isMobileNumberConfirmed = "IsMobileNumberConfirmed";
  isActive = "IsActive";
  isDeleted = "IsDeleted";
  createdBy = "CreatedBy";
  createdOn = "CreatedOn";
  updatedBy = "UpdatedBy";
  updatedOn = "UpdatedOn";
  historyTableName = "user_history";
  companyTable = "company";
  companyName = "CompanyName";
  userRoleTable = "user_role";
  userRoleName = "UserRoleName";

  findAll(): string {
    const query = `SELECT ${this.tableName}.*, ${this.companyTable}.${this.name} AS ${this.companyName}, ${this.userRoleTable}.${this.name} AS ${this.userRoleName} FROM ${this.tableName} JOIN ${this.companyTable} ON ${this.tableName}.${this.companyId} = ${this.companyTable}.${this.companyId} JOIN ${this.userRoleTable} ON ${this.tableName}.${this.userRoleId} = ${this.userRoleTable}.${this.userRoleId} WHERE ${this.tableName}.${this.isDeleted} = false`;
    this.logger.info(`Find all users query : ${query}`);
    return query;
  }
  findById(id: UserId): string {
    const query = `SELECT ${this.tableName}.*, ${this.tableName}.PasswordHash Password, ${this.companyTable}.${this.name} AS ${this.companyName}, ${this.userRoleTable}.${this.name} AS ${this.userRoleName} FROM ${this.tableName} JOIN ${this.companyTable} ON ${this.tableName}.${this.companyId} = ${this.companyTable}.${this.companyId} JOIN ${this.userRoleTable} ON ${this.tableName}.${this.userRoleId} = ${this.userRoleTable}.${this.userRoleId} WHERE ${this.tableName}.${this.userId} = ${id} AND ${this.tableName}.${this.isDeleted} = false`;
    this.logger.info(`Find user by id query : ${query}`);
    return query;
  }
  findByEmail(email: string, id?: number) {
    const query = id
      ? `SELECT *, PasswordHash Password FROM ${this.tableName} WHERE ${
          this.normalizedEmail
        } = '${email.toUpperCase()}' AND ${this.userId} != ${id} AND ${this.isDeleted} = false`
      : `SELECT *, PasswordHash Password FROM ${this.tableName} WHERE ${
          this.normalizedEmail
        } = '${email.toUpperCase()}' AND ${this.isDeleted} = false`;
    this.logger.info(`Find user by name query : ${query}`);
    return query;
  }
  create(userDetails: BaseUser, baseDetails: BaseList, companyId: number): string {
    const query = `INSERT INTO ${this.tableName} (${this.companyId}, ${this.userRoleId}, ${this.name}, ${
      this.normalizedName
    }, ${this.email}, ${this.normalizedEmail}, ${this.password}, ${this.mobileNumber}, ${this.createdBy}, ${
      this.createdOn
    }) VALUES (${companyId}, ${userDetails.userRoleId}, '${userDetails.name}', '${userDetails.name.toUpperCase()}', '${
      userDetails.email
    }', '${userDetails.email.toUpperCase()}', '${userDetails.password}', '${userDetails.mobileNumber}', ${
      baseDetails.createdBy
    }, '${baseDetails.createdOn}')`;
    this.logger.info(`Create user query : ${query}`);
    return query;
  }
  update(id: UserId, userDetails: User, baseDetails: BaseList): string {
    const query = `UPDATE ${this.tableName} SET ${this.userRoleId} = ${userDetails.userRoleId}, ${this.name} = '${
      userDetails.name
    }', ${this.normalizedName} = '${userDetails.name.toUpperCase()}', ${this.email} = '${userDetails.email}', ${
      this.normalizedEmail
    } = '${userDetails.email.toUpperCase()}', ${this.isEmailConfirmed} = '${userDetails.isEmailConfirmed}', ${
      this.password
    } = '${userDetails.password}', ${this.mobileNumber} = '${userDetails.mobileNumber}', ${
      this.isMobileNumberConfirmed
    } = '${userDetails.isMobileNumberConfirmed}', ${this.isActive} = '${userDetails.isActive}', ${this.updatedBy} = ${
      baseDetails.updatedBy
    }, ${this.updatedOn} = '${baseDetails.updatedOn}' WHERE ${this.userId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Update user query : ${query}`);
    return query;
  }
  delete(id: UserId, baseDetails: BaseList): string {
    const query = `UPDATE ${this.tableName} SET ${this.isDeleted} = ${baseDetails.isDeleted}, ${this.updatedBy} = '${baseDetails.updatedBy}', ${this.updatedOn} = '${baseDetails.updatedOn}' WHERE ${this.userId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Delete user query : ${query}`);
    return query;
  }
  createHistory(id: UserId, userDetails: User, baseDetails: BaseList, companyId: number): string {
    let query = `INSERT INTO ${this.historyTableName} (${this.userId}, ${this.companyId}, ${this.userRoleId}, ${
      this.name
    }, ${this.normalizedName}, ${this.email}, ${this.normalizedEmail}, ${this.isEmailConfirmed}, ${this.password}, ${
      this.mobileNumber
    }, ${this.isMobileNumberConfirmed}, ${this.isActive}, ${this.isDeleted}, ${this.createdBy}, ${this.createdOn}, ${
      this.updatedBy
    }, ${this.updatedOn}) VALUES (${userDetails.userId}, ${companyId}, ${userDetails.userRoleId}, '${
      userDetails.name
    }', '${userDetails.name.toUpperCase()}', '${userDetails.email}', '${userDetails.email.toUpperCase()}', '${
      userDetails.isEmailConfirmed
    }', '${userDetails.password}', '${userDetails.mobileNumber}', '${userDetails.isMobileNumberConfirmed}', '${
      userDetails.isActive
    }', '${baseDetails.isDeleted}', ${baseDetails.createdBy}, '${baseDetails.createdOn}', ${baseDetails.updatedBy}, '${
      baseDetails.updatedOn
    }')`;
    if (baseDetails.updatedOn === null) {
      query = query.replace(/'null'/g, "null");
    }
    this.logger.info(`Create user history query : ${query}`);
    return query;
  }
}
