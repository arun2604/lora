import Container, { Service } from "typedi";
import { Logger } from "winston";
import { IDatabaseManager } from "../context/database/databaseManager";
import { IDeviceRepository } from "../context/device/deviceRepository";
import { BaseDevice, DeviceId, DeviceList } from "../model/device";
import { AppLogger } from "../logger";
import { DeviceQuery } from "../const/device/deviceQuery";
import { AuthDetails, BaseList } from "../model/baseModel";

@Service(IDeviceRepository.identity)
export class DeviceRepositoryImpl extends IDeviceRepository {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getDevices(): Promise<DeviceList[] | undefined> {
    this.logger.info(`Method : ${this.getDevices.name}`);
    const devices = await this.database.executeGetQuery<DeviceList>(DeviceQuery.findAll);
    this.logger.info("Devices : " + JSON.stringify(devices));
    if (devices !== undefined) {
      return devices;
    }
  }

  async getDevice(id: DeviceId): Promise<DeviceList | undefined> {
    this.logger.info(`Method : ${this.getDevice.name}\nDevice id: ${JSON.stringify(id)}`);
    const [device] = await this.database.executeGetQuery<DeviceList>(DeviceQuery.findById, [id]);
    this.logger.info("device : " + JSON.stringify(device));
    return device;
  }

  async getDeviceByName(name: string): Promise<DeviceList | undefined> {
    this.logger.info(`Method : ${this.getDeviceByName.name}\nDevice name: ${JSON.stringify(name)}`);
    const [device] = await this.database.executeGetQuery<DeviceList>(DeviceQuery.findByName, [name]);
    this.logger.info("Device : " + JSON.stringify(device));
    return device;
  }

  async getDeviceByNameAndId(name: string, id: number): Promise<DeviceList | undefined> {
    this.logger.info(
      `Method : ${this.getDeviceByName.name}\nDevice name: ${JSON.stringify(name)}\nDevice id: ${JSON.stringify(id)}`,
    );
    const [device] = await this.database.executeGetQuery<DeviceList>(DeviceQuery.findByNameAndId, [name, id]);
    this.logger.info("Device : " + JSON.stringify(device));
    return device;
  }

  async createDevice(
    deviceDetails: BaseDevice,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<DeviceList | undefined> {
    this.logger.info(`Method : ${this.createDevice.name}\nDevice details: ${JSON.stringify(deviceDetails)}`);
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(DeviceQuery.create, [
      authDetails.companyId,
      deviceDetails.name,
      deviceDetails.name.toUpperCase(),
      deviceDetails.APIKey,
      baseDetails.createdBy,
      baseDetails.createdOn,
    ]);
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.insertId <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(DeviceQuery.createHistory, [
      result.insertId,
      authDetails.companyId,
      deviceDetails.name,
      deviceDetails.name.toUpperCase(),
      deviceDetails.APIKey,
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
    const newDevice = await this.getDevice(result.insertId);
    this.logger.info(`New Device: ${JSON.stringify(newDevice)}`);
    return newDevice;
  }

  async updateDevice(
    id: DeviceId,
    deviceDetails: DeviceList,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<DeviceList | undefined> {
    this.logger.info(
      `Method : ${this.updateDevice.name}\nDevice id: ${JSON.stringify(id)}\nDevice details: ${JSON.stringify(
        deviceDetails,
      )}`,
    );
    await this.database.executeStartTransactionQuery();
    const device = await this.getDevice(id);
    if (!device) {
      return device;
    }
    const result = await this.database.executeRunQuery(DeviceQuery.update, [
      deviceDetails.name,
      deviceDetails.name.toUpperCase(),
      deviceDetails.APIKey,
      baseDetails.updatedBy,
      baseDetails.updatedOn,
      id,
    ]);
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(DeviceQuery.createHistory, [
      id,
      authDetails.companyId,
      deviceDetails.name,
      deviceDetails.name.toUpperCase(),
      deviceDetails.APIKey,
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
    const updatedDevice = await this.getDevice(id);
    this.logger.info(`Updated device: ${JSON.stringify(updatedDevice)}`);
    return updatedDevice;
  }

  async deleteDevice(
    id: DeviceId,
    deviceDetails: BaseDevice,
    baseDetails: BaseList,
    authDetails: AuthDetails,
  ): Promise<string | undefined> {
    this.logger.info(`Method : ${this.deleteDevice.name}\nDevice id: ${JSON.stringify(id)}`);
    await this.database.executeStartTransactionQuery();
    const result = await this.database.executeRunQuery(DeviceQuery.delete, [
      baseDetails.updatedBy,
      baseDetails.updatedOn,
      id,
    ]);
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows <= 0) {
      return;
    }
    const historyResult = await this.database.executeRunQuery(DeviceQuery.createHistory, [
      id,
      authDetails.companyId,
      deviceDetails.name,
      deviceDetails.name.toUpperCase(),
      deviceDetails.APIKey,
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
    return "Device deleted successfully";
  }
}
