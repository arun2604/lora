import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Logger } from "winston";
import { AppLogger } from "../logger";
import ApiResponse from "../utilities/apiResponse";
import Container from "typedi";
import { IUserRepository } from "../context/user/userRepository";
import passport from "passport";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export class Middleware {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  userRepository: IUserRepository = Container.get(IUserRepository.identity);

  authentication(req: Request, res: Response, next: NextFunction) {
    this.logger.info("authMiddleware");
    passport.authenticate("jwt", { session: false }, (err: Error, user: Express.User, info: Error) => {
      if (err) {
        this.logger.info(`${err}`);
        const result = ApiResponse.internalServerError();
        this.logger.info(`Response body : ${JSON.stringify(result)}`);
        return res.status(result.resultCode).json(result);
      }
      if (info) {
        this.logger.info(`JWT error : ${JSON.stringify(info.message)}`);
        const result = ApiResponse.unauthorized();
        this.logger.info(`Response body : ${JSON.stringify(result)}`);
        return res.status(result.resultCode).json(result);
      }
      res.locals = user;
      next();
    })(req, res, next);
  }
}
