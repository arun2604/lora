import { Container, Service } from "typedi";
import { Logger } from "winston";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { IGroupMemberService } from "../context/groupMembers/groupMemberService";
import { IGroupMemberRepository } from "../context/groupMembers/groupMemberRepository";
import { GroupMembersMessages } from "../const/groupMembers/groupMembersMessage";
import { BaseGroupMembers, BaseGroupMembersSchema, GroupMemberId, GroupMemberList, GroupMembersIdSchema, MultipleMemberAdd } from "../model/groupMembers";
import { AuthDetails, BaseList } from "../model/baseModel";
import { getCurrentFormattedDateTime, getFormattedDateTime } from "../utilities/appUtils";
import { IDatabaseManager } from "../context/database/databaseManager";
import { IGroupRepository } from "../context/group/groupRepository";
import { GroupMessages } from "../const/group/groupMessage";
import { IDeviceRepository } from "../context/device/deviceRepository";
import { DeviceMessage } from "../const/device/deviceMessage";

@Service(IGroupMemberService.identity)
export class GroupmembersServiceImpl extends IGroupMemberService {
    database: IDatabaseManager = Container.get(IDatabaseManager.identity);
    groupMemberRepository: IGroupMemberRepository = Container.get(IGroupMemberRepository.identity);
    groupRepository: IGroupRepository = Container.get(IGroupRepository.identity);
    deviceRepository: IDeviceRepository = Container.get(IDeviceRepository.identity);
    logger: Logger = AppLogger.getInstance().getLogger(__filename);

    async getGroupMembers(): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`Working on getGroupMembers method in groupMembersServiceImpl`);
            const groups = await this.groupMemberRepository.getGroupMembers()
            this.logger.info('Result from groupMemberRepository.getGroupMembers in getGroupMembers' + JSON.stringify(groups))
            if (!groups) {
                return ApiResponse.conflict();
            }
            return ApiResponse.read(groups, GroupMembersMessages.success.read);
        }
        catch (error) {
            this.logger.info(error)
            return ApiResponse.internalServerError();
        }
    }

    async getGroupMemberById(id: number): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`Working on getGroupMemberById method in groupMembersServiceImpl with id : ${id}`);
            const groupMember: any = await this.groupMemberRepository.getGroupMembersById(id);
            this.logger.info('Result from groupMemberRepository.getGroupMembersById ' + JSON.stringify(groupMember));
            if (groupMember.length <= 0) {
                return ApiResponse.notFound();
            }
            return ApiResponse.read(groupMember[0], GroupMembersMessages.success.read);
        }
        catch (error) {
            this.logger.info(error);
            return ApiResponse.internalServerError();
        }
    }

    async createMulltipleGroupMember(groupMemberDetails: MultipleMemberAdd, authDetails: AuthDetails): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`Working on createMulltipleGroupMember method in groupMembersServiceImpl with details : ${JSON.stringify(groupMemberDetails)}`);
            if (groupMemberDetails && groupMemberDetails.selectedDevices.length > 0) {
                for (let device of groupMemberDetails.selectedDevices) {
                    let param = {
                        groupId: groupMemberDetails.groupId,
                        deviceId: device,
                    }
                    let newMember = await this.createGroupMember(param, authDetails);
                    if (!newMember.status) {
                        return ApiResponse.badRequest(newMember.message);
                    }
                }
            }
            else {
                return ApiResponse.badRequest('No devices to add');
            }
            return ApiResponse.created(null, GroupMembersMessages.success.created)
        }
        catch (error) {
            this.logger.info(error);
            return ApiResponse.internalServerError();
        }
    }

    async getGroupMemberByGroupId(id: number): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`Working on getGroupMemberByGroupId method in groupMembersServiceImpl with id : ${id}`);
            const groupMember: any = await this.groupMemberRepository.getGroupMembersByGroupId(id);
            this.logger.info('Result from groupMemberRepository.getGroupMembersByGroupId ' + JSON.stringify(groupMember));
            if (groupMember.length <= 0) {
                return ApiResponse.notFound();
            }
            return ApiResponse.read(groupMember, GroupMembersMessages.success.read);
        }
        catch (error) {
            this.logger.info(error);
            return ApiResponse.internalServerError();
        }
    }

    async getGroupMemberNotInGroup(id: number): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`working on getGroupMemberNotInGroup service with ${id}`);
            let devices = await this.deviceRepository.getDevices();
            this.logger.info("Devices : " + JSON.stringify(devices));
            if (!devices) {
                return ApiResponse.conflict();
            }
            let filterdDevice = []
            for (let i = 0; i < devices.length; i++) {
                let groupMemberExist: any = await this.groupMemberRepository.getGroupMembersByGroupDeviceId(id, devices[i].deviceId);
                this.logger.info(`groupMemberExist ${JSON.stringify(groupMemberExist)}`);
                if (groupMemberExist.length <= 0) {
                    filterdDevice.push(devices[i])
                }
            }
            if (filterdDevice.length == 0) {
                return ApiResponse.customized(true, null, 404, 'Not found');
            }
            return ApiResponse.read(filterdDevice, GroupMembersMessages.success.read);
        }
        catch (error) {
            this.logger.error(error);
            return ApiResponse.internalServerError();
        }
    }

    async createGroupMember(groupMemberDetails: BaseGroupMembers, authDetails: AuthDetails): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`working on createGroupMember service with ${JSON.stringify(groupMemberDetails)}`);
            let isvalid = BaseGroupMembersSchema.safeParse(groupMemberDetails);
            if (!isvalid.success) {
                this.logger.info(JSON.stringify(isvalid.error));
                return ApiResponse.badRequest(GroupMembersMessages.getErrorMessage(isvalid.error.issues));
            }
            let { groupId, deviceId } = groupMemberDetails;
            let isValidGroupid: any = await this.groupRepository.getGroupById(groupId)
            if (isValidGroupid.length <= 0) {
                this.logger.info(GroupMessages.failure.invalidId);
                return ApiResponse.badRequest(GroupMessages.failure.invalidId);
            }
            let isValidDeviceid: any = await this.deviceRepository.getDevice(deviceId)
            if (!isValidDeviceid) {
                this.logger.info(DeviceMessage.failure.invalidId);
                return ApiResponse.badRequest(DeviceMessage.failure.invalidId);
            }
            let groupMemberExist: any = await this.groupMemberRepository.getGroupMembersByGroupDeviceId(groupId, deviceId);
            this.logger.info(`groupMemberExist ${JSON.stringify(groupMemberExist)}`)
            if (groupMemberExist.length > 0) {
                this.logger.info(JSON.stringify(GroupMembersMessages.failure.duplicate));
                return ApiResponse.badRequest(GroupMembersMessages.failure.duplicate);
            }
            const baseDetails: BaseList = {
                isDeleted: 0,
                createdBy: authDetails.userId,
                createdOn: getCurrentFormattedDateTime(),
                updatedBy: null,
                updatedOn: null
            }
            let newGroupMember = await this.groupMemberRepository.createGroupMember(groupMemberDetails, baseDetails);
            this.logger.info("New Group member : " + JSON.stringify(newGroupMember));
            if (!newGroupMember) {
                return ApiResponse.conflict();
            }
            return ApiResponse.created(null, GroupMembersMessages.success.created)
        }
        catch (error) {
            this.logger.error(error);
            return ApiResponse.internalServerError();
        }
    }
    async updateGroupMember(id: number, groupMemberDetails: BaseGroupMembers, authDetails: AuthDetails): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`working on createGroupMember service with ${JSON.stringify(groupMemberDetails)}`);
            let isvalid = BaseGroupMembersSchema.safeParse(groupMemberDetails);
            if (!isvalid.success) {
                this.logger.info(JSON.stringify(isvalid.error));
                return ApiResponse.badRequest(GroupMembersMessages.getErrorMessage(isvalid.error.issues));
            }
            let { groupId, deviceId } = groupMemberDetails;
            let isValidGroupid: any = await this.groupRepository.getGroupById(groupId)
            if (isValidGroupid.length <= 0) {
                this.logger.info(GroupMessages.failure.invalidId);
                return ApiResponse.badRequest(GroupMessages.failure.invalidId);
            }
            let isValidDeviceid: any = await this.deviceRepository.getDevice(deviceId)
            if (!isValidDeviceid) {
                this.logger.info(DeviceMessage.failure.invalidId);
                return ApiResponse.badRequest(DeviceMessage.failure.invalidId);
            }
            let isValidGroupAndDeviceId: any = await this.groupMemberRepository.getGroupMembersByGroupDeviceId(groupId, deviceId);
            this.logger.info(`isValidGroupAndDeviceId ${JSON.stringify(isValidGroupAndDeviceId)}`)
            if (isValidGroupAndDeviceId.length >= 1) {
                this.logger.info("Group and Device already exist");
                return ApiResponse.badRequest("Group and Device already exist");
            }
            let groupMemberExist: any = await this.groupMemberRepository.getGroupMembersById(id);
            this.logger.info(`groupMemberExist ${JSON.stringify(groupMemberExist)}`);
            if (groupMemberExist.length < 1) {
                this.logger.info(JSON.stringify(GroupMembersMessages.failure.invalidId));
                return ApiResponse.badRequest(GroupMembersMessages.failure.invalidId);
            }
            const baseDetails: BaseList = {
                isDeleted: 0,
                createdBy: groupMemberExist[0].createdBy,
                createdOn: getFormattedDateTime(new Date(groupMemberExist[0].createdOn)),
                updatedBy: authDetails.userId,
                updatedOn: getCurrentFormattedDateTime()
            }
            let updatedMember = await this.groupMemberRepository.updateGroupMember(id, groupMemberDetails, baseDetails)
            this.logger.info("Updated Group member : " + JSON.stringify(updatedMember));
            if (!updatedMember) {
                return ApiResponse.conflict();
            }
            return ApiResponse.created(null, GroupMembersMessages.success.updated)
        }
        catch (error) {
            this.logger.error(error);
            return ApiResponse.internalServerError()
        }
    }

    async deleteGroupMember(id: number, authDetails: AuthDetails): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`working on deleteGroupMember service `);
            let groupMemberExist: any = await this.groupMemberRepository.getGroupMembersById(id);
            this.logger.info(`groupMemberExist ${JSON.stringify(groupMemberExist)}`);
            if (groupMemberExist.length < 1) {
                this.logger.info(JSON.stringify(GroupMembersMessages.failure.invalidId));
                return ApiResponse.badRequest(GroupMembersMessages.failure.invalidId);
            }
            let totalMembers = await this.getGroupMemberByGroupId(groupMemberExist[0].groupId);
            this.logger.info(`totalMembers ${JSON.stringify(totalMembers)}`);
            if (totalMembers.data.length <= 1) {
                this.logger.info(JSON.stringify(GroupMembersMessages.failure.minimumRequired));
                return ApiResponse.badRequest(GroupMembersMessages.failure.minimumRequired);
            }
            const baseDetails: BaseList = {
                isDeleted: 1,
                createdBy: groupMemberExist[0].createdBy,
                createdOn: getFormattedDateTime(new Date(groupMemberExist[0].createdOn)),
                updatedBy: authDetails.userId,
                updatedOn: getCurrentFormattedDateTime()
            }
            const deleteGroupMember = await this.groupMemberRepository.deleteGroupmember(id, groupMemberExist[0], baseDetails);
            this.logger.info("Result from groupMemberRepository.deleteGroupmember  : " + JSON.stringify(deleteGroupMember));
            if (!deleteGroupMember) {
                this.logger.info(GroupMembersMessages.failure.invalidId);
                return ApiResponse.badRequest(GroupMembersMessages.failure.invalidId);
            }
            return ApiResponse.deleted(GroupMembersMessages.success.deleted)
        }
        catch (error) {
            this.logger.error(error);
            return ApiResponse.internalServerError();
        }
    }
}