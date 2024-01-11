import { BaseGateway, GatewayId } from "../../model/gateway";
import ApiResponse from "../../utilities/apiResponse";

export abstract class IGatewayService {
  static identity: string = "IGatewayService";

  abstract getGateways(): Promise<ApiResponse>;
  abstract getGateway(id: GatewayId): Promise<ApiResponse>;
  abstract createGateway(gatewayDetails: BaseGateway, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract updateGateway(id: GatewayId, gatewayDetails: BaseGateway, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract deleteGateway(id: GatewayId, authDetails: Express.Locals): Promise<ApiResponse>;
}
