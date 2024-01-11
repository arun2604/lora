import { Logger } from "winston";
import Container from "typedi";
import { AppLogger } from "../logger";
import { IDatabaseManager } from "../context/database/databaseManager";
import { DatabaseManagerImpl } from "../repository/databaseManagerImpl";
import { ICompanyService } from "../context/company/companyService";
import { CompanyServiceImpl } from "../application/companyServiceImpl";
import { ICompanyRepository } from "../context/company/companyRepository";
import { CompanyRepositoryImpl } from "../repository/companyRepositoryImpl";
import { IUserRoleRepository } from "../context/userRole/userRoleRepository";
import { UserRoleRepositoryImpl } from "../repository/userRoleRepositoryImpl";
import { IUserRoleService } from "../context/userRole/userRoleService";
import { UserRoleServiceImpl } from "../application/userRoleServiceImpl";
import { IUserRepository } from "../context/user/userRepository";
import { UserRepositoryImpl } from "../repository/useRepositoryImpl";
import { IUserService } from "../context/user/userService";
import { UserServiceImpl } from "../application/userServiceImpl";
import { ILoginService } from "../context/login/loginService";
import { LoginServiceImpl } from "../application/loginServiceImpl";
import { IPermissionService } from "../context/permission/permissionService";
import { PermissionServiceImpl } from "../application/permissionServiceImpl";
import { IPermissionRepository } from "../context/permission/permissionRepository";
import { PermissionRepositoryImpl } from "../repository/permissionRepositoryImpl";
import { IInitialRouteService } from "../context/initialRoute/initialRouteService";
import { InitialRouteServiceImpl } from "../application/initialRouteServiceImpl";
import { IUserRolePermissionService } from "../context/userRolePermission/userRolePermissionService";
import { IUserRolePermissionRepository } from "../context/userRolePermission/userRolePermissionRepository";
import { UserRolePermissionRepositoryImpl } from "../repository/userRolePermissionRepositoryImpl";
import { IDeviceService } from "../context/device/deviceService";
import { DeviceServiceImpl } from "../application/deviceServiceImpl";
import { IDeviceRepository } from "../context/device/deviceRepository";
import { DeviceRepositoryImpl } from "../repository/deviceRepositoryImpl";
import { IGatewayService } from "../context/gateway/gatewayService";
import { GatewayServiceImpl } from "../application/gatewayServiceImpl";
import { IGatewayRepository } from "../context/gateway/gatewayRepository";
import { GatewayRepositoryImpl } from "../repository/gatewayRepositoryImpl";
import { IGroupRepository } from "../context/group/groupRepository";
import { GroupRepoSitoryImpl } from "../repository/groupRepositoryImpl";
import { IGroupService } from "../context/group/groupService";
import { GroupServiceImpl } from "../application/groupServiceImpl";
import { IGroupMemberRepository } from "../context/groupMembers/groupMemberRepository";
import { GroupMembersRepoSitoryImpl } from "../repository/groupMembersRepositoryImpl";
import { IGroupMemberService } from "../context/groupMembers/groupMemberService";
import { GroupmembersServiceImpl } from "../application/groupMembersServiceImpl";

/**
 * Dependency Injector
 *
 * Register all interfaces and abstractions here.
 */
export class DependencyInjector {
  static logger: Logger = AppLogger.getInstance().getLogger(__filename);
  /**
   * Register
   */
  static register(mode: string) {
    DependencyInjector.logger.info("Dependency Injector Mode : " + mode);
    //#region Higher level registration.
    Container.set(IDatabaseManager.identity, new DatabaseManagerImpl());
    //#end region

    //#region Repository registration.
    const database: IDatabaseManager = Container.get(IDatabaseManager.identity);
    database.getConnection();
    Container.set(ICompanyRepository.identity, new CompanyRepositoryImpl());
    Container.set(IUserRoleRepository.identity, new UserRoleRepositoryImpl());
    Container.set(IUserRepository.identity, new UserRepositoryImpl());
    Container.set(IPermissionRepository.identity, new PermissionRepositoryImpl());
    Container.set(IUserRolePermissionRepository.identity, new UserRolePermissionRepositoryImpl());
    Container.set(IDeviceRepository.identity, new DeviceRepositoryImpl());
    Container.set(IGatewayRepository.identity, new GatewayRepositoryImpl());
    Container.set(IGroupRepository.identity, new GroupRepoSitoryImpl());
    Container.set(IGroupMemberRepository.identity, new GroupMembersRepoSitoryImpl());
    //#end region

    //#region Service registration.
    Container.set(ILoginService.identity, new LoginServiceImpl());
    Container.set(ICompanyService.identity, new CompanyServiceImpl());
    Container.set(IUserRoleService.identity, new UserRoleServiceImpl());
    Container.set(IUserService.identity, new UserServiceImpl());
    Container.set(IPermissionService.identity, new PermissionServiceImpl());
    Container.set(IInitialRouteService.identity, new InitialRouteServiceImpl());
    Container.set(IUserRolePermissionService.identity, new UserRoleServiceImpl());
    Container.set(IDeviceService.identity, new DeviceServiceImpl());
    Container.set(IGatewayService.identity, new GatewayServiceImpl());
    Container.set(IGroupService.identity, new GroupServiceImpl());
    Container.set(IGroupMemberService.identity, new GroupmembersServiceImpl());
    //#end region
  }
}
