import { BaseUser, UserId } from "../../model/user";
import ApiResponse from "../../utilities/apiResponse";

export abstract class IUserService {
  static identity: string = "IUserService";

  abstract getUsers(): Promise<ApiResponse>;
  abstract getUser(id: UserId): Promise<ApiResponse>;
  abstract createUser(userDetails: BaseUser, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract updateUser(id: UserId, userDetails: BaseUser, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract deleteUser(id: UserId, authDetails: Express.Locals): Promise<ApiResponse>;
}
