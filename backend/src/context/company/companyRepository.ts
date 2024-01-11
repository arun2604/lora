import { BaseCompany, CompanyId, CompanyList } from "../../model/company";
import { BaseList } from "../../model/baseModel";

export abstract class ICompanyRepository {
  static identity: string = "ICompanyRepository";

  abstract getCompanies(): Promise<CompanyList[] | undefined>;
  abstract getCompany(id: CompanyId): Promise<CompanyList | undefined>;
  abstract getCompanyByName(name: string, id?: number): Promise<CompanyList | undefined>;
  abstract createCompany(companyDetails: BaseCompany, baseDetails: BaseList): Promise<CompanyList | undefined>;
  abstract updateCompany(
    id: CompanyId,
    companyDetails: BaseCompany,
    baseDetails: BaseList,
  ): Promise<CompanyList | undefined>;
  abstract deleteCompany(
    id: CompanyId,
    companyDetails: BaseCompany,
    baseDetails: BaseList,
  ): Promise<string | undefined>;
}
