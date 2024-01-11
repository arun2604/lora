import Container, { Service } from "typedi";
import { Logger } from "winston";
import { IDatabaseManager } from "../context/database/databaseManager";
import { ICompanyRepository } from "../context/company/companyRepository";
import { BaseCompany, CompanyId, CompanyList } from "../model/company";
import { AppLogger } from "../logger";
import { CompanyQuery } from "../const/company/companyQuery";
import { BaseList } from "../model/baseModel";

@Service(ICompanyRepository.identity)
export class CompanyRepositoryImpl extends ICompanyRepository {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  companyQuery = new CompanyQuery();

  async getCompanies(): Promise<CompanyList[] | undefined> {
    this.logger.info(`Method : ${this.getCompanies.name}`);
    const companies = await this.database.executeGetQuery<CompanyList>(this.companyQuery.findAll());
    this.logger.info("Companies : " + JSON.stringify(companies));
    if (companies !== undefined) {
      return companies;
    }
  }

  async getCompany(id: CompanyId): Promise<CompanyList | undefined> {
    this.logger.info(`Method : ${this.getCompany.name}\nCompany id: ${JSON.stringify(id)}`);
    const [company] = await this.database.executeGetQuery<CompanyList>(this.companyQuery.findById(id));
    this.logger.info("company : " + JSON.stringify(company));
    return company;
  }

  async getCompanyByName(name: string, id?: number): Promise<CompanyList | undefined> {
    this.logger.info(
      `Method : ${this.getCompanyByName.name}\nCompany name: ${JSON.stringify(name)}${
        id ? `\nCompany id: ${JSON.stringify(id)}` : ""
      }`,
    );
    const [company] = await this.database.executeGetQuery<CompanyList>(this.companyQuery.findByName(name, id));
    this.logger.info("Company : " + JSON.stringify(company));
    return company;
  }

  async createCompany(companyDetails: BaseCompany, baseDetails: BaseList): Promise<CompanyList | undefined> {
    this.logger.info(`Method : ${this.createCompany.name}\nCompany details: ${JSON.stringify(companyDetails)}`);
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(this.companyQuery.create(companyDetails, baseDetails));
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.insertId <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(
      this.companyQuery.createHistory(result.insertId, companyDetails, baseDetails),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    const newCompany = await this.getCompany(result.insertId);
    this.logger.info(`New Company: ${JSON.stringify(newCompany)}`);
    return newCompany;
  }

  async updateCompany(
    id: CompanyId,
    companyDetails: CompanyList,
    baseDetails: BaseList,
  ): Promise<CompanyList | undefined> {
    this.logger.info(
      `Method : ${this.updateCompany.name}\nCompany id: ${JSON.stringify(id)}\nCompany details: ${JSON.stringify(
        companyDetails,
      )}`,
    );
    await this.database.executeStartTransactionQuery();
    const company = await this.getCompany(id);
    if (!company) {
      return company;
    }
    const result = await this.database.executeRunQuery(this.companyQuery.update(id, companyDetails, baseDetails));
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(
      this.companyQuery.createHistory(id, companyDetails, baseDetails),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    const updatedCompany = await this.getCompany(id);
    this.logger.info(`Updated company: ${JSON.stringify(updatedCompany)}`);
    return updatedCompany;
  }

  async deleteCompany(id: CompanyId, companyDetails: BaseCompany, baseDetails: BaseList): Promise<string | undefined> {
    this.logger.info(`Method : ${this.deleteCompany.name}\nCompany id: ${JSON.stringify(id)}`);
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(this.companyQuery.delete(id, baseDetails));
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(
      this.companyQuery.createHistory(id, companyDetails, baseDetails),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    return "Company deleted successfully";
  }
}
