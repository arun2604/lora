import { Request, Response } from "express";
import { IBaseController } from "./baseController";
import { Logger } from "winston";
import { AppLogger } from "../logger";
import ApiResponse from "../utilities/apiResponse";

export class ProfileController extends IBaseController {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  constructor() {
    super(true, "profile");
    this.router.route(this.path).get((req, res) => this.profile(req, res));
  }

  profile(req: Request, res: Response) {
    this.logger.info("Profile");
    const result = ApiResponse.success(res.locals, "Profile details read successfully");
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }
}
