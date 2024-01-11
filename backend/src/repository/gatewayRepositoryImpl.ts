import Container, { Service } from "typedi";
import { Logger } from "winston";
import { IDatabaseManager } from "../context/database/databaseManager";
import { IGatewayRepository } from "../context/gateway/gatewayRepository";
import { BaseGateway, GatewayId, GatewayList } from "../model/gateway";
import { AppLogger } from "../logger";
import { GatewayQuery } from "../const/gateway/gatewayQuery";
import { AuthDetails, BaseList } from "../model/baseModel";

@Service(IGatewayRepository.identity)
export class GatewayRepositoryImpl extends IGatewayRepository {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getGateways(): Promise<GatewayList[] | undefined> {
    this.logger.info(`Method : ${this.getGateways.name}`);
    const gateways = await this.database.executeGetQuery<GatewayList>(GatewayQuery.findAll);
    this.logger.info("Gateways : " + JSON.stringify(gateways));
    if (gateways !== undefined) {
      return gateways;
    }
  }

  async getGateway(id: GatewayId): Promise<GatewayList | undefined> {
    this.logger.info(`Method : ${this.getGateway.name}\nGateway id: ${JSON.stringify(id)}`);
    const [gateway] = await this.database.executeGetQuery<GatewayList>(GatewayQuery.findById, [id]);
    this.logger.info("gateway : " + JSON.stringify(gateway));
    return gateway;
  }

  async getGatewayByName(name: string): Promise<GatewayList | undefined> {
    this.logger.info(`Method : ${this.getGatewayByName.name}\nGateway name: ${JSON.stringify(name)}`);
    const [gateway] = await this.database.executeGetQuery<GatewayList>(GatewayQuery.findByName, [name]);
    this.logger.info("Gateway : " + JSON.stringify(gateway));
    return gateway;
  }

  async getGatewayByNameAndId(name: string, id: number): Promise<GatewayList | undefined> {
    this.logger.info(
      `Method : ${this.getGatewayByName.name}\nGateway name: ${JSON.stringify(name)}\nGateway id: ${JSON.stringify(
        id,
      )}`,
    );
    const [gateway] = await this.database.executeGetQuery<GatewayList>(GatewayQuery.findByNameAndId, [name, id]);
    this.logger.info("Gateway : " + JSON.stringify(gateway));
    return gateway;
  }

  async createGateway(
    gatewayDetails: BaseGateway,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<GatewayList | undefined> {
    this.logger.info(`Method : ${this.createGateway.name}\nGateway details: ${JSON.stringify(gatewayDetails)}`);
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(GatewayQuery.create, [
      authDetails.companyId,
      gatewayDetails.name,
      gatewayDetails.name.toUpperCase(),
      gatewayDetails.URL,
      baseDetails.createdBy,
      baseDetails.createdOn,
    ]);
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.insertId <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(GatewayQuery.createHistory, [
      result.insertId,
      authDetails.companyId,
      gatewayDetails.name,
      gatewayDetails.name.toUpperCase(),
      gatewayDetails.URL,
      baseDetails.isDeleted,
      baseDetails.createdBy,
      baseDetails.createdOn,
      baseDetails.updatedBy,
      baseDetails.updatedOn,
    ]);
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    const newGateway = await this.getGateway(result.insertId);
    this.logger.info(`New Gateway: ${JSON.stringify(newGateway)}`);
    return newGateway;
  }

  async updateGateway(
    id: GatewayId,
    gatewayDetails: GatewayList,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<GatewayList | undefined> {
    this.logger.info(
      `Method : ${this.updateGateway.name}\nGateway id: ${JSON.stringify(id)}\nGateway details: ${JSON.stringify(
        gatewayDetails,
      )}`,
    );
    await this.database.executeStartTransactionQuery();
    const gateway = await this.getGateway(id);
    if (!gateway) {
      return gateway;
    }
    const result = await this.database.executeRunQuery(GatewayQuery.update, [
      gatewayDetails.name,
      gatewayDetails.name.toUpperCase(),
      gatewayDetails.URL,
      baseDetails.updatedBy,
      baseDetails.updatedOn,
      id,
    ]);
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(GatewayQuery.createHistory, [
      id,
      authDetails.companyId,
      gatewayDetails.name,
      gatewayDetails.name.toUpperCase(),
      gatewayDetails.URL,
      baseDetails.isDeleted,
      baseDetails.createdBy,
      baseDetails.createdOn,
      baseDetails.updatedBy,
      baseDetails.updatedOn,
    ]);
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    const updatedGateway = await this.getGateway(id);
    this.logger.info(`Updated gateway: ${JSON.stringify(updatedGateway)}`);
    return updatedGateway;
  }

  async deleteGateway(
    id: GatewayId,
    gatewayDetails: BaseGateway,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<string | undefined> {
    this.logger.info(`Method : ${this.deleteGateway.name}\nGateway id: ${JSON.stringify(id)}`);
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(GatewayQuery.delete, [
      baseDetails.updatedBy,
      baseDetails.updatedOn,
      id,
    ]);
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(GatewayQuery.createHistory, [
      id,
      authDetails.companyId,
      gatewayDetails.name,
      gatewayDetails.name.toUpperCase(),
      gatewayDetails.URL,
      baseDetails.isDeleted,
      baseDetails.createdBy,
      baseDetails.createdOn,
      baseDetails.updatedBy,
      baseDetails.updatedOn,
    ]);
    this.logger.info("History result : " + JSON.stringify(historyResult));
    if (historyResult.insertId <= 0) {
      return;
    }
    await this.database.executeCommitQuery();
    return "Gateway deleted successfully";
  }
}
