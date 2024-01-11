import { Request, Response } from "express";
import { IBaseController } from "./baseController";
import { Logger } from "winston";
import { AppLogger } from "../logger";
import Container from "typedi";
import { IInitialRouteService } from "../context/initialRoute/initialRouteService";
import { InitialRoute } from "../model/initialRoute";

export class InitialRouteController extends IBaseController {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  initialRouteService: IInitialRouteService = Container.get(IInitialRouteService.identity);

  constructor() {
    super(false, "initial-route/:username/:password");
    this.router.route(this.path).get((req, res) => this.initialRoute(req, res));
  }

  async initialRoute(req: Request, res: Response) {
    this.logger.info(`Method : ${this.initialRoute.name}\nParams : ${JSON.stringify(req.params)}`);
    const userDetails: InitialRoute = { username: req.params.username, password: req.params.password };
    const result = await this.initialRouteService.initialRoute(userDetails);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }
}
