import ApiResponse from "../../utilities/apiResponse";
import { EmailLogin } from "../../model/login";

export abstract class ILoginService {
  static identity: string = "ILoginService";

  abstract login(loginDetails: EmailLogin): Promise<ApiResponse>;
}
