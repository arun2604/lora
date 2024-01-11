import { Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { IBaseController } from "./baseController";
import { AppLogger } from "../logger";
import { IDeviceService } from "../context/device/deviceService";

export class DeviceController extends IBaseController {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  deviceService: IDeviceService = Container.get(IDeviceService.identity);

  constructor() {
    super(true, "device");
    this.router
      .route(this.path)
      .get((req, res) => this.getDevices(req, res))
      .post((req, res) => this.createDevice(req, res));
    this.router
      .route(this.path + "/:id")
      .get((req, res) => this.getDevice(req, res))
      .put((req, res) => this.updateDevice(req, res))
      .delete((req, res) => this.deleteDevice(req, res));
  }

  async getDevices(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getDevices.name}`);
    const result = await this.deviceService.getDevices();
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async getDevice(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getDevice.name}\nParams : ${JSON.stringify(req.params.id)}`);
    const id = Number(req.params.id);
    const result = await this.deviceService.getDevice(id);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async createDevice(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.createDevice.name}\nRequest body : ${JSON.stringify(req.body)}`);
    const result = await this.deviceService.createDevice(req.body, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async updateDevice(req: Request, res: Response): Promise<void> {
    this.logger.info(
      `Method : ${this.updateDevice.name}\nParams : ${JSON.stringify(req.params.id)}\nRequest body : ${JSON.stringify(
        req.body,
      )}`,
    );
    const id = Number(req.params.id);
    const result = await this.deviceService.updateDevice(id, req.body, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async deleteDevice(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.deleteDevice.name}\nParams : ${JSON.stringify(req.params.id)}`);
    const id = Number(req.params.id);
    this.logger.info(`Request body : ${JSON.stringify(req.body)}`);
    const result = await this.deviceService.deleteDevice(id, res.locals);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }
}
