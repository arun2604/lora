import express, { Express, Request, Response } from "express";
import { Logger } from "winston";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import passportJwt from "passport-jwt";
import Container from "typedi";
import { DependencyInjector } from "./domain/dependencyInjector";
import { AppLogger } from "./logger";
import { HomeController } from "./controller/homeController";
import { IBaseController } from "./controller/baseController";
import { CompanyController } from "./controller/companyController";
import { UserRoleController } from "./controller/userRoleController";
import { UserController } from "./controller/userController";
import { LoginController } from "./controller/loginController";
import { PermissionController } from "./controller/permissionController";
import { InitialRouteController } from "./controller/initialRouteController";
import { IUserRepository } from "./context/user/userRepository";
import { NotFoundController } from "./controller/notFoundController";
import { ProfileController } from "./controller/profileController";
import { DeviceController } from "./controller/deviceController";
import { Middleware } from "./middlewares/middleware";
import { GatewayController } from "./controller/gatewayController";
import { GroupController } from "./controller/groupController";
import { GroupMemberController } from "./controller/groupMembersController";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const nodeEnv: string = process.env.NODE_ENV as string;
const appVersion: string = process.env.APP_VERSION as string;
const port: number = parseInt(process.env.EXPOSE_PORT as string, 10);
const hostName: string = process.env.IDENTITY_ISSUER_URL as string;
const dependencyInjectorMode: string = process.env.DEPENDENCY_INJECTOR_MODE as string;
const logger: Logger = AppLogger.getInstance().getLogger(__filename);

logger.info(`NODE_ENV : ${nodeEnv}`);
logger.info(`APP_VERSION : ${appVersion}`);

export const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(passport.initialize());

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

DependencyInjector.register(dependencyInjectorMode);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.IDENTITY_JWT_KEY as string,
    },
    async (jwtPayload: Express.User, done) => {
      try {
        logger.info(`JWT payload : ${JSON.stringify(jwtPayload)}`);
        const userRepository: IUserRepository = Container.get(IUserRepository.identity);
        const user = await userRepository.getUser(jwtPayload.userId);
        if (user) {
          logger.info(`Valid user id : ${JSON.stringify(jwtPayload.userId)}`);
          return done(null, user);
        } else {
          logger.info(`Invalid user id : ${JSON.stringify(jwtPayload.userId)}`);
          return done(null, false, { message: `Invalid user id : ${JSON.stringify(jwtPayload.userId)}` });
        }
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user: Express.User, cb) {
  cb(null, user);
});

morgan.token("fullUrl", (req: Request, res: Response) => {
  return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
});

morgan.token("body", (req: Request, res: Response) => {
  let body = req.body;
  return Object.keys(body).length === 0 ? "-" : JSON.stringify(body);
});

app.use(
  morgan(
    ":method Request :fullUrl Body :body Status :status Response length :res[content-length] - :response-time ms",
    {
      stream: {
        write: (message: string) => {
          logger.info(`${message.trim()}\n${"-".repeat(100)}`);
        },
      },
    },
  ),
);

const controllers: IBaseController[] = [
  new InitialRouteController(),
  new HomeController(),
  new LoginController(),
  new ProfileController(),
  new CompanyController(),
  new UserRoleController(),
  new UserController(),
  new PermissionController(),
  new DeviceController(),
  new GatewayController(),
  new GroupController(),
  new GroupMemberController(),
  new NotFoundController(),
];

app.use("/auth", (req, res, next) => new Middleware().authentication(req, res, next));

controllers.forEach((each: IBaseController) => app.use(each.router));

app.listen(port, hostName, () => {
  logger.info(`Server is running at http://${hostName}:${port}`);
});
