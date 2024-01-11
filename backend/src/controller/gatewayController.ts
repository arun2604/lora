import { Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { IBaseController } from "./baseController";
import { AppLogger } from "../logger";
import { IGatewayService } from "../context/gateway/gatewayService";

export class GatewayController extends IBaseController {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  gatewayService: IGatewayService = Container.get(IGatewayService.identity);

  constructor() {
    super(true, "gateway");
    this.router
      .route(this.path)
      .get((req, res) => this.getGateways(req, res))
      .post((req, res) => this.createGateway(req, res));
    this.router
      .route(this.path + "/:id")
      .get((req, res) => this.getGateway(req, res))
      .put((req, res) => this.updateGateway(req, res))
      .delete((req, res) => this.deleteGateway(req, res));
  }

  async getGateways(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getGateways.name}`);
    const result = await this.gatewayService.getGateways();
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async getGateway(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getGateway.name}\nParams : ${JSON.stringify(req.params.id)}`);
    const id = Number(req.params.id);
    const result = await this.gatewayService.getGateway(id);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async createGateway(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.createGateway.name}\nRequest body : ${JSON.stringify(req.body)}`);
    const result = await this.gatewayService.createGateway(req.body, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async updateGateway(req: Request, res: Response): Promise<void> {
    this.logger.info(
      `Method : ${this.updateGateway.name}\nParams : ${JSON.stringify(req.params.id)}\nRequest body : ${JSON.stringify(
        req.body,
      )}`,
    );
    const id = Number(req.params.id);
    const result = await this.gatewayService.updateGateway(id, req.body, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async deleteGateway(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.deleteGateway.name}\nParams : ${JSON.stringify(req.params.id)}`);
    const id = Number(req.params.id);
    this.logger.info(`Request body : ${JSON.stringify(req.body)}`);
    const result = await this.gatewayService.deleteGateway(id, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }
}
