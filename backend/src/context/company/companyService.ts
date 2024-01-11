import { BaseCompany, CompanyId } from "../../model/company";
import ApiResponse from "../../utilities/apiResponse";

export abstract class ICompanyService {
  static identity: string = "ICompanyService";

  abstract getCompanies(): Promise<ApiResponse>;
  abstract getCompany(id: CompanyId): Promise<ApiResponse>;
  abstract createCompany(companyDetails: BaseCompany, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract updateCompany(id: CompanyId, companyDetails: BaseCompany, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract deleteCompany(id: CompanyId, authDetails: Express.Locals): Promise<ApiResponse>;
}
