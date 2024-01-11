import { BaseDevice, DeviceId } from "../../model/device";
import ApiResponse from "../../utilities/apiResponse";

export abstract class IDeviceService {
  static identity: string = "IDeviceService";

  abstract getDevices(): Promise<ApiResponse>;
  abstract getDevice(id: DeviceId): Promise<ApiResponse>;
  abstract createDevice(deviceDetails: BaseDevice, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract updateDevice(id: DeviceId, deviceDetails: BaseDevice, authDetails: Express.Locals): Promise<ApiResponse>;
  abstract deleteDevice(id: DeviceId, authDetails: Express.Locals): Promise<ApiResponse>;
}
