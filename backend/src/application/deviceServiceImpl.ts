import { Container, Service } from "typedi";
import { Logger } from "winston";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { IDeviceService } from "../context/device/deviceService";
import { IDeviceRepository } from "../context/device/deviceRepository";
import { DeviceMessage } from "../const/device/deviceMessage";
import { BaseDevice, BaseDeviceSchema, DeviceId, DeviceIdSchema } from "../model/device";
import { AuthDetails, BaseList } from "../model/baseModel";
import { IDatabaseManager } from "../context/database/databaseManager";
import { getCurrentFormattedDateTime, getFormattedDateTime } from "../utilities/appUtils";

@Service(IDeviceService.identity)
export class DeviceServiceImpl extends IDeviceService {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  deviceRepository: IDeviceRepository = Container.get(IDeviceRepository.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getDevices(): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getDevices.name}`);
      const devices = await this.deviceRepository.getDevices();
      this.logger.info("Devices : " + JSON.stringify(devices));
      if (!devices) {
        return ApiResponse.conflict();
      }
      return ApiResponse.read(devices, DeviceMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async getDevice(id: DeviceId): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getDevice.name}\nDevice id: ${JSON.stringify(id)}`);
      const validId = DeviceIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(DeviceMessage.getErrorMessage(validId.error.issues));
      }
      const device = await this.deviceRepository.getDevice(id);
      this.logger.info("Device : " + JSON.stringify(device));
      if (!device) {
        this.logger.info(DeviceMessage.failure.invalidId);
        return ApiResponse.badRequest(DeviceMessage.failure.invalidId);
      }
      return ApiResponse.read(device, DeviceMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async createDevice(deviceDetails: BaseDevice, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.createDevice.name}\nDevice Details : ${JSON.stringify(deviceDetails)}`);
      const validDevice = BaseDeviceSchema.safeParse(deviceDetails);
      if (!validDevice.success) {
        this.logger.info(JSON.stringify(validDevice.error));
        return ApiResponse.badRequest(DeviceMessage.getErrorMessage(validDevice.error.issues));
      }
      const validName = await this.deviceRepository.getDeviceByName(validDevice.data.name);
      if (validName) {
        this.logger.info(JSON.stringify(DeviceMessage.failure.duplicateName));
        return ApiResponse.badRequest(DeviceMessage.failure.duplicateName);
      }
      const baseDetails: BaseList = {
        isDeleted: 0,
        createdBy: authDetails.userId,
        createdOn: getCurrentFormattedDateTime(),
        updatedBy: null,
        updatedOn: null,
      };
      const newDevice = await this.deviceRepository.createDevice(validDevice.data, baseDetails, authDetails);
      this.logger.info("New device : " + JSON.stringify(newDevice));
      if (!newDevice) {
        return ApiResponse.conflict();
      }
      await this.database.executeCommitQuery();
      return ApiResponse.created(newDevice, DeviceMessage.success.created);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async updateDevice(id: DeviceId, deviceDetails: BaseDevice, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.updateDevice.name}\nDevice id: ${JSON.stringify(id)}\nDevice Details : ${JSON.stringify(
          deviceDetails,
        )}`,
      );
      const validId = DeviceIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(DeviceMessage.getErrorMessage(validId.error.issues));
      }
      const validDevice = BaseDeviceSchema.safeParse(deviceDetails);
      if (!validDevice.success) {
        this.logger.info(JSON.stringify(validDevice.error));
        return ApiResponse.badRequest(DeviceMessage.getErrorMessage(validDevice.error.issues));
      }
      const validName = await this.deviceRepository.getDeviceByNameAndId(validDevice.data.name, id);
      if (validName) {
        this.logger.info(JSON.stringify(DeviceMessage.failure.duplicateName));
        return ApiResponse.badRequest(DeviceMessage.failure.duplicateName);
      }
      const device = await this.deviceRepository.getDevice(id);
      if (!device) {
        this.logger.info(DeviceMessage.failure.invalidId);
        return ApiResponse.badRequest(DeviceMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: device.isDeleted,
        createdBy: device.createdBy,
        createdOn: getFormattedDateTime(new Date(device.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const updatedDevice = await this.deviceRepository.updateDevice(id, validDevice.data, baseDetails, authDetails);
      this.logger.info("Updated device : " + JSON.stringify(updatedDevice));
      if (!updatedDevice) {
        this.logger.info(DeviceMessage.failure.invalidId);
        return ApiResponse.badRequest(DeviceMessage.failure.invalidId);
      }
      return ApiResponse.updated(updatedDevice, DeviceMessage.success.updated);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async deleteDevice(id: DeviceId, authDetails: AuthDetails): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.deleteDevice.name}\nDevice id: ${JSON.stringify(id)}`);
      const validId = DeviceIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(DeviceMessage.getErrorMessage(validId.error.issues));
      }
      const deviceDetails = await this.deviceRepository.getDevice(id);
      if (!deviceDetails) {
        this.logger.info(DeviceMessage.failure.invalidId);
        return ApiResponse.badRequest(DeviceMessage.failure.invalidId);
      }
      const baseDetails: BaseList = {
        isDeleted: 1,
        createdBy: deviceDetails.createdBy,
        createdOn: getFormattedDateTime(new Date(deviceDetails.createdOn)),
        updatedBy: authDetails.userId,
        updatedOn: getCurrentFormattedDateTime(),
      };
      const deleteDevice = await this.deviceRepository.deleteDevice(id, deviceDetails, baseDetails, authDetails);
      if (!deleteDevice) {
        this.logger.info(DeviceMessage.failure.invalidId);
        return ApiResponse.badRequest(DeviceMessage.failure.invalidId);
      }
      return ApiResponse.deleted(DeviceMessage.success.deleted);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }
}
