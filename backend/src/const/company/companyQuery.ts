import { Logger } from "winston";
import { AppLogger } from "../../logger";
import { BaseCompany, CompanyId } from "../../model/company";
import { BaseList } from "../../model/baseModel";

export class CompanyQuery {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  tableName = "company";
  companyId = "companyId";
  name = "Name";
  normalizedName = "NormalizedName";
  email = "Email";
  mobileNumber = "MobileNumber";
  landmark = "Landmark";
  city = "City";
  state = "State";
  country = "Country";
  zipCode = "ZipCode";
  isDeleted = "IsDeleted";
  createdBy = "CreatedBy";
  createdOn = "CreatedOn";
  updatedBy = "UpdatedBy";
  updatedOn = "UpdatedOn";
  historyTableName = "company_history";

  findAll(): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.isDeleted} = false`;
    this.logger.info(`Find all companies query : ${query}`);
    return query;
  }
  findById(id: CompanyId): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.companyId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Find company by id query : ${query}`);
    return query;
  }
  findByName(name: string, id?: number) {
    const query = id
      ? `SELECT * FROM ${this.tableName} WHERE ${this.normalizedName} = '${name.toUpperCase()}' AND ${
          this.companyId
        } != ${id} AND ${this.isDeleted} = false`
      : `SELECT * FROM ${this.tableName} WHERE ${this.normalizedName} = '${name.toUpperCase()}' AND ${
          this.isDeleted
        } = false`;
    this.logger.info(`Find company by name query : ${query}`);
    return query;
  }
  create(companyDetails: BaseCompany, baseDetails: BaseList): string {
    const query = `INSERT INTO ${this.tableName} (${this.name}, ${this.normalizedName}, ${this.email}, ${
      this.mobileNumber
    }, ${this.landmark}, ${this.city}, ${this.state}, ${this.country}, ${this.zipCode}, ${this.createdBy}, ${
      this.createdOn
    }) VALUES ('${companyDetails.name}', '${companyDetails.name.toUpperCase()}', '${companyDetails.email}', '${
      companyDetails.mobileNumber
    }', '${companyDetails.landmark}', '${companyDetails.city}', '${companyDetails.state}', '${
      companyDetails.country
    }', '${companyDetails.zipCode}', '${baseDetails.createdBy}', '${baseDetails.createdOn}')`;
    this.logger.info(`Create company query : ${query}`);
    return query;
  }
  update(id: CompanyId, companyDetails: BaseCompany, baseDetails: BaseList): string {
    const query = `UPDATE ${this.tableName} SET ${this.name} = '${companyDetails.name}', ${
      this.normalizedName
    } = '${companyDetails.name.toUpperCase()}', ${this.email} = '${companyDetails.email}', ${this.mobileNumber} = '${
      companyDetails.mobileNumber
    }', ${this.landmark} = '${companyDetails.landmark}', ${this.city} = '${companyDetails.city}', ${this.state} = '${
      companyDetails.state
    }', ${this.country} = '${companyDetails.country}', ${this.zipCode} = '${companyDetails.zipCode}', ${
      this.updatedBy
    } = '${baseDetails.updatedBy}', ${this.updatedOn} = '${baseDetails.updatedOn}' WHERE ${
      this.companyId
    } = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Update company query : ${query}`);
    return query;
  }
  delete(id: CompanyId, baseDetails: BaseList): string {
    const query = `UPDATE ${this.tableName} SET ${this.isDeleted} = ${baseDetails.isDeleted}, ${this.updatedBy} = '${baseDetails.updatedBy}', ${this.updatedOn} = '${baseDetails.updatedOn}' WHERE ${this.companyId} = ${id} AND ${this.isDeleted} = false`;
    this.logger.info(`Delete company query : ${query}`);
    return query;
  }
  createHistory(id: CompanyId, companyDetails: BaseCompany, baseDetails: BaseList): string {
    let query = `INSERT INTO ${this.historyTableName} (${this.companyId}, ${this.name}, ${this.normalizedName}, ${
      this.email
    }, ${this.mobileNumber}, ${this.landmark}, ${this.city}, ${this.state}, ${this.country}, ${this.zipCode}, ${
      this.isDeleted
    }, ${this.createdBy}, ${this.createdOn}, ${this.updatedBy}, ${this.updatedOn}) VALUES (${id}, '${
      companyDetails.name
    }', '${companyDetails.name.toUpperCase()}', '${companyDetails.email}', '${companyDetails.mobileNumber}', '${
      companyDetails.landmark
    }', '${companyDetails.city}', '${companyDetails.state}', '${companyDetails.country}', '${
      companyDetails.zipCode
    }', '${baseDetails.isDeleted}', ${baseDetails.createdBy}, '${baseDetails.createdOn}', ${baseDetails.updatedBy}, '${
      baseDetails.updatedOn
    }')`;
    if (baseDetails.updatedOn === null) {
      query = query.replace(/'null'/g, "null");
    }
    this.logger.info(`Create company history query : ${query}`);
    return query;
  }
}
