import ApiResponse from "../../utilities/apiResponse";
import { InitialRoute } from "../../model/initialRoute";

export abstract class IInitialRouteService {
  static identity: string = "IInitialRouteService";

  abstract initialRoute(userDetails: InitialRoute): Promise<ApiResponse>;
}
