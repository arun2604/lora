import { Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { IBaseController } from "./baseController";
import { AppLogger } from "../logger";
import { ILoginService } from "../context/login/loginService";

export class LoginController extends IBaseController {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  loginService: ILoginService = Container.get(ILoginService.identity);

  constructor() {
    super(false, "login");
    this.router.route(this.path).post((req, res) => this.login(req, res));
  }

  async login(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.login.name}\nRequest body : ${JSON.stringify(req.body)}`);
    const result = await this.loginService.login(req.body);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }
}
