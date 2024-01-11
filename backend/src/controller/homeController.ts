import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { IBaseController } from "./baseController";
import { Logger } from "winston";
import { AppLogger } from "../logger";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export class HomeController extends IBaseController {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  constructor() {
    super(false, "");
    this.router.route(this.path).get((req, res) => this.homePage(req, res));
  }

  async homePage(req: Request, res: Response) {
    this.logger.info("homePage");
    const homePagePath = path.join(__dirname, "../view/home.html");
    let htmlContent = fs.readFileSync(homePagePath, { encoding: "utf8", flag: "r" });
    htmlContent = htmlContent.replace(/@NODE_ENV/g, process.env.NODE_ENV as string);
    htmlContent = htmlContent.replace(/@IDENTITY_ISSUER_URL/g, process.env.IDENTITY_ISSUER_URL as string);
    htmlContent = htmlContent.replace(/@EXPOSE_PORT/g, process.env.EXPOSE_PORT as string);
    htmlContent = htmlContent.replace(/@APP_VERSION/g, process.env.APP_VERSION as string);
    htmlContent = htmlContent.replace(/@DEPENDENCY_INJECTOR_MODE/g, process.env.DEPENDENCY_INJECTOR_MODE as string);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlContent);
  }
}
