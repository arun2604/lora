import { BaseDevice, DeviceId, DeviceList } from "../../model/device";
import { AuthDetails, BaseList } from "../../model/baseModel";

export abstract class IDeviceRepository {
  static identity: string = "IDeviceRepository";

  abstract getDevices(): Promise<DeviceList[] | undefined>;
  abstract getDevice(id: DeviceId): Promise<DeviceList | undefined>;
  abstract getDeviceByName(name: string): Promise<DeviceList | undefined>;
  abstract getDeviceByNameAndId(name: string, id: number): Promise<DeviceList | undefined>;
  abstract createDevice(
    deviceDetails: BaseDevice,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<DeviceList | undefined>;
  abstract updateDevice(
    id: DeviceId,
    deviceDetails: BaseDevice,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<DeviceList | undefined>;
  abstract deleteDevice(
    id: DeviceId,
    deviceDetails: BaseDevice,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<string | undefined>;
}
