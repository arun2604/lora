import express, { Request, Response, Router } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { IBaseController } from "./baseController";
import { AppLogger } from "../logger";
import { IPermissionService } from "../context/permission/permissionService";

export class PermissionController extends IBaseController {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  permissionService: IPermissionService = Container.get(IPermissionService.identity);

  constructor() {
    super(true, "permission");
    this.router
      .route(this.path)
      .get((req, res) => this.getPermissions(req, res))
      .post((req, res) => this.createPermission(req, res));
    this.router
      .route(this.path + "/:id")
      .get((req, res) => this.getPermission(req, res))
      .put((req, res) => this.updatePermission(req, res))
      .delete((req, res) => this.deletePermission(req, res));
  }

  async getPermissions(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getPermissions.name}`);
    const result = await this.permissionService.getPermissions();
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async getPermission(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getPermission.name}\nParams : ${JSON.stringify(req.params.id)}`);
    const id = Number(req.params.id);
    const result = await this.permissionService.getPermission(id);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async createPermission(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.createPermission.name}\nRequest body : ${JSON.stringify(req.body)}`);
    const result = await this.permissionService.createPermission(req.body, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async updatePermission(req: Request, res: Response): Promise<void> {
    this.logger.info(
      `Method : ${this.updatePermission.name}\nParams : ${JSON.stringify(
        req.params.id,
      )}\nRequest body : ${JSON.stringify(req.body)}`,
    );
    const id = Number(req.params.id);
    const result = await this.permissionService.updatePermission(id, req.body, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async deletePermission(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.deletePermission.name}\nParams : ${JSON.stringify(req.params.id)}`);
    const id = Number(req.params.id);
    this.logger.info(`Request body : ${JSON.stringify(req.body)}`);
    const result = await this.permissionService.deletePermission(id, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }
}
