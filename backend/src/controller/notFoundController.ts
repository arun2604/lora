import { Request, Response } from "express";
import { IBaseController } from "./baseController";
import { Logger } from "winston";
import { AppLogger } from "../logger";
import ApiResponse from "../utilities/apiResponse";

export class NotFoundController extends IBaseController {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  constructor() {
    super(false, "*");
    this.router.all(this.path, (req, res) => this.notFoundPage(req, res));
  }

  notFoundPage(req: Request, res: Response) {
    this.logger.info("Not found page");
    const result = ApiResponse.notFound();
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }
}
