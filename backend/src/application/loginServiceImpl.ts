import { Container, Service } from "typedi";
import dotenv from "dotenv";
import { Logger } from "winston";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { ILoginService } from "../context/login/loginService";
import { EmailLogin, LoginSchema, PayLoad } from "../model/login";
import { LoginMessage } from "../const/login/loginMessage";
import { IUserRepository } from "../context/user/userRepository";
import { User } from "../model/user";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

@Service(ILoginService.identity)
export class LoginServiceImpl extends ILoginService {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  userRepository: IUserRepository = Container.get(IUserRepository.identity);

  generateTokenData(user: User): {
    accessToken: string;
    tokenType: string;
    expiresIn: Date;
  } {
    const payload: PayLoad = {
      userId: user.userId,
      companyId: user.companyId,
      loggedOn: new Date(),
    };
    const expiresIn = Number(process.env.IDENTITY_TOKEN_EXPIRY_TIMESPAN) * 60 * 60;
    const expireDate = new Date(new Date().getTime() + expiresIn * 1000);
    const jwtToken = jwt.sign(payload, process.env.IDENTITY_JWT_KEY as string, {
      expiresIn,
    });
    const data = {
      accessToken: jwtToken,
      tokenType: "Bearer",
      expiresIn: expireDate,
    };
    return data;
  }

  async login(emailLoginDetails: EmailLogin): Promise<ApiResponse> {
    const validLoginDetails = LoginSchema.safeParse(emailLoginDetails);
    if (!validLoginDetails.success) {
      this.logger.info(JSON.stringify(validLoginDetails.error));
      return ApiResponse.badRequest(LoginMessage.getErrorMessage(validLoginDetails.error.issues));
    }
    const user = await this.userRepository.getUserByEmail(validLoginDetails.data.email);
    if (!user) {
      this.logger.info(JSON.stringify(LoginMessage.failure.invalidEmail));
      return ApiResponse.badRequest(LoginMessage.failure.invalidEmail);
    }
    const encryptPassword = user.password;
    const isPasswordMatched = await bcrypt.compare(validLoginDetails.data.password, encryptPassword);
    if (isPasswordMatched) {
      const data = this.generateTokenData(user);
      this.logger.info(JSON.stringify(LoginMessage.success.validUser));
      return ApiResponse.success(data, LoginMessage.success.validUser);
    } else {
      this.logger.info(JSON.stringify(LoginMessage.failure.invalidPassword));
      return ApiResponse.badRequest(LoginMessage.failure.invalidPassword);
    }
  }
}
