import { Container, Service } from "typedi";
import dotenv from "dotenv";
import { Logger } from "winston";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { IInitialRouteService } from "../context/initialRoute/initialRouteService";
import { InitialRoute } from "../model/initialRoute";
import { AuthDetails } from "../model/baseModel";
import companiesList from "../data/company.json";
import { ICompanyService } from "../context/company/companyService";
import userRoleList from "../data/userRole.json";
import { IUserRoleService } from "../context/userRole/userRoleService";
import permissionList from "../data/permission.json";
import { IPermissionService } from "../context/permission/permissionService";
import { IPermissionRepository } from "../context/permission/permissionRepository";
import userList from "../data/user.json";
import { IUserService } from "../context/user/userService";
import { IUserRoleRepository } from "../context/userRole/userRoleRepository";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

@Service(IInitialRouteService.identity)
export class InitialRouteServiceImpl extends IInitialRouteService {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  companyService: ICompanyService = Container.get(ICompanyService.identity);
  permissionService: IPermissionService = Container.get(IPermissionService.identity);
  permissionRepository: IPermissionRepository = Container.get(IPermissionRepository.identity);
  userRoleService: IUserRoleService = Container.get(IUserRoleService.identity);
  userRoleRepository: IUserRoleRepository = Container.get(IUserRoleRepository.identity);
  userService: IUserService = Container.get(IUserService.identity);

  async initialRoute(userDetails: InitialRoute): Promise<ApiResponse> {
    const initializeUsername = process.env.INITIALIZE_USERNAME as string;
    const initializePassword = process.env.INITIALIZE_PASSWORD as string;
    if (userDetails.username !== initializeUsername || userDetails.password !== initializePassword) {
      this.logger.info("Invalid initialize username or password");
      return ApiResponse.unauthorized("Invalid initialize username or password");
    }
    const authDetails: AuthDetails = { userId: 0, companyId: 1 };
    // Create all companies
    this.logger.info("Creating companies");
    for (const eachCompany of companiesList.company) {
      const result = await this.companyService.createCompany(eachCompany, authDetails);
      this.logger.info(`Result : ${JSON.stringify(result)}`);
      if (result.resultCode === 500) {
        this.logger.info("Something went wrong");
        return ApiResponse.internalServerError();
      }
    }
    this.logger.info("Created companies");
    // Create all permissions
    this.logger.info("Creating all permissions");
    for (const eachPermission of permissionList.permission) {
      const result = await this.permissionService.createPermission(eachPermission, authDetails);
      this.logger.info(`Result : ${JSON.stringify(result)}`);
      if (result.resultCode === 500) {
        this.logger.info("Something went wrong");
        return ApiResponse.internalServerError();
      }
    }
    this.logger.info("Created all permissions");
    // Create all user roles
    this.logger.info("Creating user roles");
    for (let eachUserRole of userRoleList.userRole) {
      const permissions = [];
      for (const eachPermission of eachUserRole.permissions) {
        const permission = await this.permissionRepository.getPermissionByName(eachPermission.permissionName);
        if (!permission) {
          this.logger.info("Invalid permission name");
          continue;
        }
        permissions.push({ permissionId: permission.permissionId });
      }
      const userRoleDetails = { name: eachUserRole.name, permissions };
      const result = await this.userRoleService.createUserRole(userRoleDetails, authDetails);
      this.logger.info(`Result : ${JSON.stringify(result)}`);
      if (result.resultCode === 500) {
        this.logger.info("Something went wrong");
        return ApiResponse.internalServerError();
      }
    }
    this.logger.info("Created user roles");
    // Create all user
    this.logger.info("Creating user");
    for (const eachUser of userList.user) {
      const userRole = await this.userRoleRepository.getUserRoleByName(eachUser.userRoleName);
      if (!userRole) {
        this.logger.info("User role name not found");
        continue;
      }
      const userDetails = { ...eachUser, userRoleId: userRole.userRoleId };
      const result = await this.userService.createUser(userDetails, authDetails);
      this.logger.info(`Result : ${JSON.stringify(result)}`);
      if (result.resultCode === 500) {
        this.logger.info("Something went wrong");
        return ApiResponse.internalServerError();
      }
    }
    this.logger.info("Created user");
    return ApiResponse.success(null, "Created all default details");
  }
}
