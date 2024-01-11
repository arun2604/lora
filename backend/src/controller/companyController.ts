import { Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { IBaseController } from "./baseController";
import { AppLogger } from "../logger";
import { ICompanyService } from "../context/company/companyService";

export class CompanyController extends IBaseController {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  companyService: ICompanyService = Container.get(ICompanyService.identity);

  constructor() {
    super(true, "company");
    this.router
      .route(this.path)
      .get((req, res) => this.getCompanies(req, res))
      .post((req, res) => this.createCompany(req, res));
    this.router
      .route(this.path + "/:id")
      .get((req, res) => this.getCompany(req, res))
      .put((req, res) => this.updateCompany(req, res))
      .delete((req, res) => this.deleteCompany(req, res));
  }

  async getCompanies(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getCompanies.name}`);
    const result = await this.companyService.getCompanies();
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async getCompany(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getCompany.name}\nParams : ${JSON.stringify(req.params.id)}`);
    const id = Number(req.params.id);
    const result = await this.companyService.getCompany(id);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async createCompany(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.createCompany.name}\nRequest body : ${JSON.stringify(req.body)}`);
    const result = await this.companyService.createCompany(req.body, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async updateCompany(req: Request, res: Response): Promise<void> {
    this.logger.info(
      `Method : ${this.updateCompany.name}\nParams : ${JSON.stringify(req.params.id)}\nRequest body : ${JSON.stringify(
        req.body,
      )}`,
    );
    const id = Number(req.params.id);
    const result = await this.companyService.updateCompany(id, req.body, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async deleteCompany(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.deleteCompany.name}\nParams : ${JSON.stringify(req.params.id)}`);
    const id = Number(req.params.id);
    this.logger.info(`Request body : ${JSON.stringify(req.body)}`);
    const result = await this.companyService.deleteCompany(id, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }
}
