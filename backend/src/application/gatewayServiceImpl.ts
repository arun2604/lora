import { Container, Service } from "typedi";
import { Logger } from "winston";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { IGatewayService } from "../context/gateway/gatewayService";
import { IGatewayRepository } from "../context/gateway/gatewayRepository";
import { GatewayMessage } from "../const/gateway/gatewayMessage";
import { BaseGateway, BaseGatewaySchema, GatewayId, GatewayIdSchema } from "../model/gateway";
import { AuthDetails, BaseList } from "../model/baseModel";
import { IDatabaseManager } from "../context/database/databaseManager";
import { getCurrentFormattedDateTime, getFormattedDateTime } from "../utilities/appUtils";

@Service(IGatewayService.identity)
export class GatewayServiceImpl extends IGatewayService {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  gatewayRepository: IGatewayRepository = Container.get(IGatewayRepository.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getGateways(): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getGateways.name}`);
      const gateways = await this.gatewayRepository.getGateways();
      this.logger.info("Gateways : " + JSON.stringify(gateways));
      if (!gateways) {
        return ApiResponse.conflict();
      }
      return ApiResponse.read(gateways, GatewayMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async getGateway(id: GatewayId): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getGateway.name}\nGateway id: ${JSON.stringify(id)}`);
      const validId = GatewayIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(GatewayMessage.getErrorMessage(validId.error.issues));
      }
      const gateway = await this.gatewayRepository.getGateway(id);
      this.logger.info("Gateway : " + JSON.stringify(gateway));
      if (!gateway) {
        this.logger.info(GatewayMessage.failure.invalidId);
        return ApiResponse.badRequest(GatewayMessage.failure.invalidId);
      }
      return ApiResponse.read(gateway, GatewayMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async createGateway(gatewayDetails: BaseGateway, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.createGateway.name}\nGateway Details : ${JSON.stringify(gatewayDetails)}`);
      const validGateway = BaseGatewaySchema.safeParse(gatewayDetails);
      if (!validGateway.success) {
        this.logger.info(JSON.stringify(validGateway.error));
        return ApiResponse.badRequest(GatewayMessage.getErrorMessage(validGateway.error.issues));
      }
      const validName = await this.gatewayRepository.getGatewayByName(validGateway.data.name);
      if (validName) {
        this.logger.info(JSON.stringify(GatewayMessage.failure.duplicateName));
        return ApiResponse.badRequest(GatewayMessage.failure.duplicateName);
      }
      const baseDetails: BaseList = {
        isDeleted: 0,
        createdBy: authDetails.userId,
        createdOn: getCurrentFormattedDateTime(),
        updatedBy: null,
        updatedOn: null,
      };
      const newGateway = await this.gatewayRepository.createGateway(validGateway.data, baseDetails, authDetails);
      this.logger.info("New gateway : " + JSON.stringify(newGateway));
      if (!newGateway) {
        return ApiResponse.conflict();
      }
      await this.database.executeCommitQuery();
      return ApiResponse.created(newGateway, GatewayMessage.success.created);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async updateGateway(id: GatewayId, gatewayDetails: BaseGateway, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.updateGateway.name}\nGateway id: ${JSON.stringify(id)}\nGateway Details : ${JSON.stringify(
          gatewayDetails,
        )}`,
      );
      const validId = GatewayIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(GatewayMessage.getErrorMessage(validId.error.issues));
      }
      const validGateway = BaseGatewaySchema.safeParse(gatewayDetails);
      if (!validGateway.success) {
        this.logger.info(JSON.stringify(validGateway.error));
        return ApiResponse.badRequest(GatewayMessage.getErrorMessage(validGateway.error.issues));
      }
      const validName = await this.gatewayRepository.getGatewayByNameAndId(validGateway.data.name, id);
      if (validName) {
        this.logger.info(JSON.stringify(GatewayMessage.failure.duplicateName));
        return ApiResponse.badRequest(GatewayMessage.failure.duplicateName);
      }
      const gateway = await this.gatewayRepository.getGateway(id);
      if (!gateway) {
        this.logger.info(GatewayMessage.failure.invalidId);
        return ApiResponse.badRequest(GatewayMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: gateway.isDeleted,
        createdBy: gateway.createdBy,
        createdOn: getFormattedDateTime(new Date(gateway.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const updatedGateway = await this.gatewayRepository.updateGateway(
        id,
        validGateway.data,
        baseDetails,
        authDetails,
      );
      this.logger.info("Updated gateway : " + JSON.stringify(updatedGateway));
      if (!updatedGateway) {
        this.logger.info(GatewayMessage.failure.invalidId);
        return ApiResponse.badRequest(GatewayMessage.failure.invalidId);
      }
      return ApiResponse.updated(updatedGateway, GatewayMessage.success.updated);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async deleteGateway(id: GatewayId, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.deleteGateway.name}\nGateway id: ${JSON.stringify(id)}`);
      const validId = GatewayIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(GatewayMessage.getErrorMessage(validId.error.issues));
      }
      const gatewayDetails = await this.gatewayRepository.getGateway(id);
      if (!gatewayDetails) {
        this.logger.info(GatewayMessage.failure.invalidId);
        return ApiResponse.badRequest(GatewayMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: 1,
        createdBy: gatewayDetails.createdBy,
        createdOn: getFormattedDateTime(new Date(gatewayDetails.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const deleteGateway = await this.gatewayRepository.deleteGateway(id, gatewayDetails, baseDetails, authDetails);
      if (!deleteGateway) {
        this.logger.info(GatewayMessage.failure.invalidId);
        return ApiResponse.badRequest(GatewayMessage.failure.invalidId);
      }
      return ApiResponse.deleted(GatewayMessage.success.deleted);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }
}
