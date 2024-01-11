import { BaseUser, User, UserId, UserList } from "../../model/user";
import { AuthDetails, BaseList } from "../../model/baseModel";

export abstract class IUserRepository {
  static identity: string = "IUserRepository";

  abstract getUsers(): Promise<UserList[] | undefined>;
  abstract getUser(id: UserId): Promise<UserList | undefined>;
  abstract getUserByEmail(email: string, id?: number): Promise<UserList | undefined>;
  abstract createUser(
    userDetails: BaseUser,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<UserList | undefined>;
  abstract updateUser(
    id: UserId,
    userDetails: User,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<UserList | undefined>;
  abstract deleteUser(
    id: UserId,
    userDetails: User,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<string | undefined>;
}
