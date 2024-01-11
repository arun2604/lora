import Container, { Service } from "typedi";
import { RowDataPacket } from "mysql2";
import { Logger } from "winston";
import * as bcrypt from "bcrypt";
import { IDatabaseManager } from "../context/database/databaseManager";
import { IUserRepository } from "../context/user/userRepository";
import { BaseUser, User, UserId, UserList } from "../model/user";
import { AppLogger } from "../logger";
import { UserQuery } from "../const/user/userQuery";
import { AuthDetails, BaseList } from "../model/baseModel";

@Service(IUserRepository.identity)
export class UserRepositoryImpl extends IUserRepository {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  userQuery = new UserQuery();

  async getUsers(): Promise<UserList[] | undefined> {
    this.logger.info(`Method : ${this.getUsers.name}`);
    const users = await this.database.executeGetQuery<UserList>(this.userQuery.findAll());
    this.logger.info("Users : " + JSON.stringify(users));
    if (users !== undefined) {
      return users;
    }
  }

  async getUser(id: UserId): Promise<UserList | undefined> {
    this.logger.info(`Method : ${this.getUser.name}\nUser id: ${JSON.stringify(id)}`);
    const [user] = await this.database.executeGetQuery<UserList>(this.userQuery.findById(id));
    this.logger.info("User : " + JSON.stringify(user));
    return user;
  }

  async getUserByEmail(email: string, id?: number): Promise<UserList | undefined> {
    this.logger.info(
      `Method : ${this.getUserByEmail.name}\nEmail : ${JSON.stringify(email)}${
        id ? `\nUser id: ${JSON.stringify(id)}` : ""
      }`,
    );
    const [user] = await this.database.executeGetQuery<UserList>(this.userQuery.findByEmail(email, id));
    this.logger.info("User : " + JSON.stringify(user));
    return user;
  }

  async createUser(
    userDetails: BaseUser,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<UserList | undefined> {
    this.logger.info(`Method : ${this.createUser.name}\nUser details: ${JSON.stringify(userDetails)}`);
    const encryptPassword = await bcrypt.hash(userDetails.password, 10);
    userDetails.password = encryptPassword;
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(
      this.userQuery.create(userDetails, baseDetails, authDetails.companyId),
    );
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.insertId <= 0) {
      return;
    }
    const newUser = await this.getUser(result.insertId);
    if (!newUser) {
      return;
    }
    this.logger.info(`New User: ${JSON.stringify(newUser)}`);
    const historyResult = await this.database.executeRunQuery(
      this.userQuery.createHistory(result.insertId, newUser, baseDetails, authDetails.companyId),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    return newUser;
  }

  async updateUser(
    id: UserId,
    userDetails: User,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<UserList | undefined> {
    this.logger.info(
      `Method : ${this.updateUser.name}\nUser id: ${JSON.stringify(id)}\nUser details: ${JSON.stringify(userDetails)}`,
    );
    const encryptPassword = await bcrypt.hash(userDetails.password, 10);
    userDetails.password = encryptPassword;
    await this.database.executeStartTransactionQuery();
    const user = await this.getUser(id);
    if (!user) {
      return user;
    }
    const result = await this.database.executeRunQuery(this.userQuery.update(id, userDetails, baseDetails));
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(
      this.userQuery.createHistory(id, userDetails, baseDetails, authDetails.companyId),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    const updatedUser = await this.getUser(id);
    this.logger.info(`Updated user: ${JSON.stringify(updatedUser)}`);
    return updatedUser;
  }

  async deleteUser(
    id: UserId,
    userDetails: User,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<string | undefined> {
    this.logger.info(`Method : ${this.deleteUser.name}\nUser id: ${JSON.stringify(id)}`);
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(this.userQuery.delete(id, baseDetails));
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(
      this.userQuery.createHistory(id, userDetails, baseDetails, authDetails.companyId),
    );
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    return "User deleted successfully";
  }
}
