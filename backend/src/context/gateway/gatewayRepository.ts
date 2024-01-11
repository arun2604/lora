import { BaseGateway, GatewayId, GatewayList } from "../../model/gateway";
import { AuthDetails, BaseList } from "../../model/baseModel";

export abstract class IGatewayRepository {
  static identity: string = "IGatewayRepository";

  abstract getGateways(): Promise<GatewayList[] | undefined>;
  abstract getGateway(id: GatewayId): Promise<GatewayList | undefined>;
  abstract getGatewayByName(name: string): Promise<GatewayList | undefined>;
  abstract getGatewayByNameAndId(name: string, id: number): Promise<GatewayList | undefined>;
  abstract createGateway(
    deviceDetails: BaseGateway,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<GatewayList | undefined>;
  abstract updateGateway(
    id: GatewayId,
    deviceDetails: BaseGateway,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<GatewayList | undefined>;
  abstract deleteGateway(
    id: GatewayId,
    deviceDetails: BaseGateway,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<string | undefined>;
}
