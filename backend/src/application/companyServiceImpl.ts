import { Container, Service } from "typedi";
import { Logger } from "winston";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { ICompanyService } from "../context/company/companyService";
import { ICompanyRepository } from "../context/company/companyRepository";
import { CompanyMessage } from "../const/company/companyMessage";
import { BaseCompany, BaseCompanySchema, CompanyId, CompanyIdSchema } from "../model/company";
import { AuthDetails, BaseList } from "../model/baseModel";
import { IDatabaseManager } from "../context/database/databaseManager";
import { getCurrentFormattedDateTime, getFormattedDateTime } from "../utilities/appUtils";

@Service(ICompanyService.identity)
export class CompanyServiceImpl extends ICompanyService {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  companyRepository: ICompanyRepository = Container.get(ICompanyRepository.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getCompanies(): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getCompanies.name}`);
      const companies = await this.companyRepository.getCompanies();
      this.logger.info("Companies : " + JSON.stringify(companies));
      if (!companies) {
        return ApiResponse.conflict();
      }
      return ApiResponse.read(companies, CompanyMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async getCompany(id: CompanyId): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getCompany.name}\nCompany id: ${JSON.stringify(id)}`);
      const validId = CompanyIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(CompanyMessage.getErrorMessage(validId.error.issues));
      }
      const company = await this.companyRepository.getCompany(id);
      this.logger.info("Company : " + JSON.stringify(company));
      if (!company) {
        this.logger.info(CompanyMessage.failure.invalidId);
        return ApiResponse.badRequest(CompanyMessage.failure.invalidId);
      }
      return ApiResponse.read(company, CompanyMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async createCompany(companyDetails: BaseCompany, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.createCompany.name}\nCompany Details : ${JSON.stringify(companyDetails)}`);
      const validCompany = BaseCompanySchema.safeParse(companyDetails);
      if (!validCompany.success) {
        this.logger.info(JSON.stringify(validCompany.error));
        return ApiResponse.badRequest(CompanyMessage.getErrorMessage(validCompany.error.issues));
      }
      const validName = await this.companyRepository.getCompanyByName(validCompany.data.name);
      if (validName) {
        this.logger.info(JSON.stringify(CompanyMessage.failure.duplicateName));
        return ApiResponse.badRequest(CompanyMessage.failure.duplicateName);
      }
      const baseDetails: BaseList = {
        isDeleted: 0,
        createdBy: authDetails.userId,
        createdOn: getCurrentFormattedDateTime(),
        updatedBy: null,
        updatedOn: null,
      };
      const newCompany = await this.companyRepository.createCompany(validCompany.data, baseDetails);
      this.logger.info("New company : " + JSON.stringify(newCompany));
      if (!newCompany) {
        return ApiResponse.conflict();
      }
      await this.database.executeCommitQuery();
      return ApiResponse.created(newCompany, CompanyMessage.success.created);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async updateCompany(id: CompanyId, companyDetails: BaseCompany, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.updateCompany.name}\nCompany id: ${JSON.stringify(id)}\nCompany Details : ${JSON.stringify(
          companyDetails,
        )}`,
      );
      const validId = CompanyIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(CompanyMessage.getErrorMessage(validId.error.issues));
      }
      const validCompany = BaseCompanySchema.safeParse(companyDetails);
      if (!validCompany.success) {
        this.logger.info(JSON.stringify(validCompany.error));
        return ApiResponse.badRequest(CompanyMessage.getErrorMessage(validCompany.error.issues));
      }
      const validName = await this.companyRepository.getCompanyByName(validCompany.data.name, id);
      if (validName) {
        this.logger.info(JSON.stringify(CompanyMessage.failure.duplicateName));
        return ApiResponse.badRequest(CompanyMessage.failure.duplicateName);
      }
      const company = await this.companyRepository.getCompany(id);
      if (!company) {
        this.logger.info(CompanyMessage.failure.invalidId);
        return ApiResponse.badRequest(CompanyMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: company.isDeleted,
        createdBy: company.createdBy,
        createdOn: getFormattedDateTime(new Date(company.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const updatedCompany = await this.companyRepository.updateCompany(id, validCompany.data, baseDetails);
      this.logger.info("Updated company : " + JSON.stringify(updatedCompany));
      if (!updatedCompany) {
        this.logger.info(CompanyMessage.failure.invalidId);
        return ApiResponse.badRequest(CompanyMessage.failure.invalidId);
      }
      return ApiResponse.updated(updatedCompany, CompanyMessage.success.updated);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async deleteCompany(id: CompanyId, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.deleteCompany.name}\nCompany id: ${JSON.stringify(id)}`);
      const validId = CompanyIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(CompanyMessage.getErrorMessage(validId.error.issues));
      }
      const companyDetails = await this.companyRepository.getCompany(id);
      if (!companyDetails) {
        this.logger.info(CompanyMessage.failure.invalidId);
        return ApiResponse.badRequest(CompanyMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: 1,
        createdBy: companyDetails.createdBy,
        createdOn: getFormattedDateTime(new Date(companyDetails.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const deleteCompany = await this.companyRepository.deleteCompany(id, companyDetails, baseDetails);
      if (!deleteCompany) {
        this.logger.info(CompanyMessage.failure.invalidId);
        return ApiResponse.badRequest(CompanyMessage.failure.invalidId);
      }
      return ApiResponse.deleted(CompanyMessage.success.deleted);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }
}
