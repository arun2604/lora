import { Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { IBaseController } from "./baseController";
import { AppLogger } from "../logger";
import { IUserRoleService } from "../context/userRole/userRoleService";

export class UserRoleController extends IBaseController {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  userRoleService: IUserRoleService = Container.get(IUserRoleService.identity);

  constructor() {
    super(true, "user-role");
    this.router
      .route(this.path)
      .get((req, res) => this.getUserRoles(req, res))
      .post((req, res) => this.createUserRole(req, res));
    this.router
      .route(this.path + "/:id")
      .get((req, res) => this.getUserRole(req, res))
      .put((req, res) => this.updateUserRole(req, res))
      .delete((req, res) => this.deleteUserRole(req, res));
  }

  async getUserRoles(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getUserRoles.name}`);
    const result = await this.userRoleService.getUserRoles();
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async getUserRole(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getUserRole.name}\nParams : ${JSON.stringify(req.params.id)}`);
    const id = Number(req.params.id);
    const result = await this.userRoleService.getUserRole(id);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async createUserRole(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.createUserRole.name}\nRequest body : ${JSON.stringify(req.body)}`);
    const result = await this.userRoleService.createUserRole(req.body, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async updateUserRole(req: Request, res: Response): Promise<void> {
    this.logger.info(
      `Method : ${this.updateUserRole.name}\nParams : ${JSON.stringify(req.params.id)}\nRequest body : ${JSON.stringify(
        req.body,
      )}`,
    );
    const id = Number(req.params.id);
    const result = await this.userRoleService.updateUserRole(id, req.body, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async deleteUserRole(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.deleteUserRole.name}\nParams : ${JSON.stringify(req.params.id)}`);
    const id = Number(req.params.id);
    this.logger.info(`Request body : ${JSON.stringify(req.body)}`);
    const result = await this.userRoleService.deleteUserRole(id, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }
}
