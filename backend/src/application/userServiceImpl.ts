import { Container, Service } from "typedi";
import { Logger } from "winston";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { IUserService } from "../context/user/userService";
import { IUserRepository } from "../context/user/userRepository";
import { UserMessage } from "../const/user/userMessage";
import { BaseUser, BaseUserSchema, UserId, UserIdSchema } from "../model/user";
import { AuthDetails, BaseList } from "../model/baseModel";
import { IDatabaseManager } from "../context/database/databaseManager";
import { getCurrentFormattedDateTime, getFormattedDateTime } from "../utilities/appUtils";
import { CompanyMessage } from "../const/company/companyMessage";
import { IUserRoleRepository } from "../context/userRole/userRoleRepository";
import { UserRoleMessage } from "../const/userRole/userRoleMessage";

@Service(IUserService.identity)
export class UserServiceImpl extends IUserService {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  userRepository: IUserRepository = Container.get(IUserRepository.identity);
  userRoleRepository: IUserRoleRepository = Container.get(IUserRoleRepository.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getUsers(): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getUsers.name}`);
      const users = await this.userRepository.getUsers();
      this.logger.info("Users : " + JSON.stringify(users));
      if (!users) {
        return ApiResponse.conflict();
      }
      return ApiResponse.read(users, UserMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async getUser(id: UserId): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getUser.name}\nUser id: ${JSON.stringify(id)}`);
      const validId = UserIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(UserMessage.getErrorMessage(validId.error.issues));
      }
      const user = await this.userRepository.getUser(id);
      this.logger.info("User : " + JSON.stringify(user));
      if (!user) {
        this.logger.info(UserMessage.failure.invalidId);
        return ApiResponse.badRequest(UserMessage.failure.invalidId);
      }
      return ApiResponse.read(user, UserMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async createUser(userDetails: BaseUser, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.createUser.name}\nUser Details : ${JSON.stringify(userDetails)}`);
      const validUser = BaseUserSchema.safeParse(userDetails);
      if (!validUser.success) {
        this.logger.info(JSON.stringify(validUser.error));
        return ApiResponse.badRequest(UserMessage.getErrorMessage(validUser.error.issues));
      }
      const userRole = await this.userRoleRepository.getUserRole(validUser.data.userRoleId);
      if (!userRole) {
        return ApiResponse.badRequest(UserRoleMessage.failure.invalidId);
      }
      const validName = await this.userRepository.getUserByEmail(validUser.data.email);
      if (validName) {
        this.logger.info(JSON.stringify(UserMessage.failure.duplicateEmail));
        return ApiResponse.badRequest(UserMessage.failure.duplicateEmail);
      }
      const baseDetails: BaseList = {
        isDeleted: 0,
        createdBy: authDetails.userId,
        createdOn: getCurrentFormattedDateTime(),
        updatedBy: null,
        updatedOn: null,
      };
      const newUser = await this.userRepository.createUser(validUser.data, baseDetails, authDetails);
      this.logger.info("New user : " + JSON.stringify(newUser));
      if (!newUser) {
        return ApiResponse.conflict();
      }
      await this.database.executeCommitQuery();
      return ApiResponse.created(newUser, UserMessage.success.created);
    } catch (error) {
      this.logger.error(`${error}`);
      await this.database.executeRollBackQuery();
      return ApiResponse.internalServerError();
    }
  }

  async updateUser(id: UserId, userDetails: BaseUser, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.updateUser.name}\nUser id: ${JSON.stringify(id)}\nUser Details : ${JSON.stringify(
          userDetails,
        )}`,
      );
      const validId = UserIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(UserMessage.getErrorMessage(validId.error.issues));
      }
      const validUser = BaseUserSchema.safeParse(userDetails);
      if (!validUser.success) {
        this.logger.info(JSON.stringify(validUser.error));
        return ApiResponse.badRequest(UserMessage.getErrorMessage(validUser.error.issues));
      }
      const userRole = await this.userRoleRepository.getUserRole(validUser.data.userRoleId);
      if (!userRole) {
        return ApiResponse.badRequest(UserRoleMessage.failure.invalidId);
      }
      const validName = await this.userRepository.getUserByEmail(validUser.data.email, id);
      if (validName) {
        this.logger.info(JSON.stringify(UserMessage.failure.duplicateEmail));
        return ApiResponse.badRequest(UserMessage.failure.duplicateEmail);
      }
      const user = await this.userRepository.getUser(id);
      if (!user) {
        this.logger.info(UserMessage.failure.invalidId);
        return ApiResponse.badRequest(UserMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: user.isDeleted,
        createdBy: user.createdBy,
        createdOn: getFormattedDateTime(new Date(user.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const updatedUser = await this.userRepository.updateUser(
        id,
        { ...user, ...validUser.data },
        baseDetails,
        authDetails,
      );
      this.logger.info("Updated user : " + JSON.stringify(updatedUser));
      if (!updatedUser) {
        this.logger.info(UserMessage.failure.invalidId);
        return ApiResponse.badRequest(UserMessage.failure.invalidId);
      }
      return ApiResponse.updated(updatedUser, UserMessage.success.updated);
    } catch (error) {
      this.logger.error(`${error}`);
      await this.database.executeRollBackQuery();
      return ApiResponse.internalServerError();
    }
  }

  async deleteUser(id: UserId, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.deleteUser.name}\nUser id: ${JSON.stringify(id)}`);
      const validId = UserIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(UserMessage.getErrorMessage(validId.error.issues));
      }
      const userDetails = await this.userRepository.getUser(id);
      if (!userDetails) {
        this.logger.info(UserMessage.failure.invalidId);
        return ApiResponse.badRequest(UserMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: 1,
        createdBy: userDetails.createdBy,
        createdOn: getFormattedDateTime(new Date(userDetails.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const deleteUser = await this.userRepository.deleteUser(id, userDetails, baseDetails, authDetails);
      if (!deleteUser) {
        this.logger.info(UserMessage.failure.invalidId);
        return ApiResponse.badRequest(UserMessage.failure.invalidId);
      }
      return ApiResponse.deleted(UserMessage.success.deleted);
    } catch (error) {
      this.logger.error(`${error}`);
      await this.database.executeRollBackQuery();
      return ApiResponse.internalServerError();
    }
  }
}
