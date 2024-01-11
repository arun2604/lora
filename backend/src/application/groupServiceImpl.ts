import { Container, Service } from "typedi";
import { Logger } from "winston";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { IGroupService } from "../context/group/groupService";
import { IGroupRepository } from "../context/group/groupRepository";
import { GroupMessages } from "../const/group/groupMessage";
import { BaseGroup, BaseGroupSchema, GroupId, GroupIdSchema, GroupList } from "../model/group";
import { AuthDetails, BaseDetails, BaseList } from "../model/baseModel";
import { getCurrentFormattedDateTime, getFormattedDateTime } from "../utilities/appUtils";
import { IDatabaseManager } from "../context/database/databaseManager";
import { IGroupMemberRepository } from "../context/groupMembers/groupMemberRepository";
import { GroupMembersMessages } from "../const/groupMembers/groupMembersMessage";
import { IDeviceRepository } from "../context/device/deviceRepository";
import { DeviceMessage } from "../const/device/deviceMessage";

@Service(IGroupService.identity)
export class GroupServiceImpl extends IGroupService {
    database: IDatabaseManager = Container.get(IDatabaseManager.identity);
    groupRepository: IGroupRepository = Container.get(IGroupRepository.identity);
    deviceRepository: IDeviceRepository = Container.get(IDeviceRepository.identity)
    groupMemberRepository: IGroupMemberRepository = Container.get(IGroupMemberRepository.identity)
    logger: Logger = AppLogger.getInstance().getLogger(__filename);

    async getGroups(): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`Working on getGroups method in groupServiceImpl`);
            let groups = await this.groupRepository.getGroups()
            this.logger.info('Result from groupRepository.getGroup in getGroups' + JSON.stringify(groups))
            if (!groups) {
                return ApiResponse.conflict();
            }
            let newGroup = []
            for (let i of groups) {
                if (i && i.groupId) {
                    let members: any = await this.groupMemberRepository.getGroupMembersByGroupId(i.groupId)
                    newGroup.push({ ...i, memberCount: members.length })
                }
            }
            groups = newGroup;
            return ApiResponse.read(groups, GroupMessages.success.read);
        }
        catch (error) {
            this.logger.info(error)
            return ApiResponse.internalServerError();
        }
    }

    async getGroupById(id: number): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`Working on getGroupById method in groupServiceImpl with id : ${id}`);
            const group: any = await this.groupRepository.getGroupById(id);
            this.logger.info('Result from groupRepository.getGroupById in getGroupById' + JSON.stringify(group));
            if (group.length <= 0) {
                return ApiResponse.notFound();
            }
            return ApiResponse.read(group[0], GroupMessages.success.read);
        }
        catch (error) {
            this.logger.info(error);
            return ApiResponse.internalServerError();
        }
    }

    async getGroupDetails(id: number): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`Working on getGroupDetails method in groupServiceImpl with id : ${id}`);
            const group: any = await this.groupRepository.getGroupById(id);
            this.logger.info('Result from groupRepository.getGroupById in getGroupDetails' + JSON.stringify(group));
            if (group.length <= 0) {
                return ApiResponse.notFound();
            }
            const groupMember: any = await this.groupMemberRepository.getGroupMembersByGroupId(id)
            this.logger.info('Result from groupMemberRepository.getGroupMembersByGroupId in getGroupDetails' + JSON.stringify(groupMember));
            if (groupMember.length <= 0) {
                return ApiResponse.notFound();
            }
            return ApiResponse.read({ groupDetails: group[0], memberDetails: groupMember }, GroupMessages.success.read);
        }
        catch (error) {
            this.logger.info(error);
            return ApiResponse.internalServerError();
        }
    }

    async createGroups(groupDetails: any, authDetails: AuthDetails): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`working on createGroups method in groupServiceImpl \n with group details ${JSON.stringify(groupDetails)}`);
            let newName = groupDetails.name.split('');
            newName.splice(0, 1, newName[0].toUpperCase())
            groupDetails.name = newName.join('')
            let isExist: any = await this.groupRepository.getGroupByName(groupDetails.name);
            this.logger.info(`isExist ${JSON.stringify(isExist)}`)
            if (isExist.length >= 1) {
                this.logger.info(JSON.stringify(GroupMessages.failure.duplicateName));
                return ApiResponse.badRequest(GroupMessages.failure.duplicateName);
            }
            const baseDetails: BaseDetails = {
                companyId: authDetails.companyId,
                isDeleted: 0,
                createdBy: authDetails.userId,
                createdOn: getCurrentFormattedDateTime(),
                updatedBy: null,
                updatedOn: null,
            };
            const newGroup: any = await this.groupRepository.createGroups(groupDetails, baseDetails);
            this.logger.info("New Group : " + JSON.stringify(newGroup));
            if (newGroup.length > 0) {
                let groupmember;
                groupDetails.devices.map((device: any) => {
                    let groupMemberDetails = {
                        groupId: newGroup[0].groupId,
                        deviceId: device.id,
                    }
                    groupmember = this.groupMemberRepository.createGroupMember(groupMemberDetails, baseDetails)
                    if (!groupmember) {
                        return ApiResponse.conflict();
                    }
                })
            }
            if (!newGroup) {
                return ApiResponse.conflict();
            }
            return ApiResponse.created(null, GroupMessages.success.created)
        }
        catch (error) {
            this.logger.error(error);
            return ApiResponse.internalServerError();
        }
    }

    async updateGroupAndMembers(id: string, groupDetails: any, authDetails: AuthDetails): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`working on updateGroupAndMembers method in groupServiceImpl \n with group details ${JSON.stringify(groupDetails)} and group id : ${id}`);
            let groupById = await this.getGroupById(Number(id))
            if (groupById.data.name != groupDetails.name) {
                let isExist: any = await this.groupRepository.getGroupByName(groupDetails.name);
                this.logger.info(`isExist ${JSON.stringify(isExist)}`)
                if (isExist.length >= 1) {
                    this.logger.info(JSON.stringify(GroupMessages.failure.duplicateName));
                    return ApiResponse.badRequest(GroupMessages.failure.duplicateName);
                }
            }
            let updateGroup = await this.updateGroup(id, { name: groupDetails.name }, authDetails)
            if (!updateGroup.status) {
                return ApiResponse.customized(false, null, 400, updateGroup.message);
            }
            for (let i of groupDetails.members) {
                if (i.isDeleted) {
                    let groupMember: any = await this.groupMemberRepository.getGroupMembersByGroupDeviceId(Number(id), i.id)
                    if (groupMember.length < 1) {
                        return ApiResponse.notFound()
                    }
                    const baseDetails: BaseList = {
                        isDeleted: 1,
                        createdBy: groupMember[0].createdBy,
                        createdOn: getFormattedDateTime(new Date(groupMember[0].createdOn)),
                        updatedBy: authDetails.userId,
                        updatedOn: getCurrentFormattedDateTime()
                    }
                    let deleted = await this.groupMemberRepository.deleteGroupmember(groupMember[0].groupMemberId, { groupId: Number(id), deviceId: groupMember[0].deviceId }, baseDetails);
                    if (!deleted) {
                        return ApiResponse.notModified()
                    }
                }
                else {
                    let groupMember: any = await this.groupMemberRepository.getGroupMembersByGroupDeviceId(Number(id), i.id)
                    if (groupMember.length < 1) {
                        let isValidGroupid: any = await this.groupRepository.getGroupById(Number(id))
                        if (isValidGroupid.length <= 0) {
                            this.logger.info(GroupMessages.failure.invalidId);
                            return ApiResponse.badRequest(GroupMessages.failure.invalidId);
                        }
                        let isValidDeviceid: any = await this.deviceRepository.getDevice(i.id)
                        if (!isValidDeviceid) {
                            this.logger.info(DeviceMessage.failure.invalidId);
                            return ApiResponse.badRequest(DeviceMessage.failure.invalidId);
                        }
                        const baseDetails: BaseList = {
                            isDeleted: 0,
                            createdBy: authDetails.userId,
                            createdOn: getCurrentFormattedDateTime(),
                            updatedBy: null,
                            updatedOn: null
                        }
                        let newGroupMember = await this.groupMemberRepository.createGroupMember({ groupId: Number(id), deviceId: i.id }, baseDetails);
                        this.logger.info("New Group member : " + JSON.stringify(newGroupMember));
                        if (!newGroupMember) {
                            return ApiResponse.conflict();
                        }
                    }
                }
            }
            return ApiResponse.updated(null, GroupMessages.success.updated)
        }
        catch (err) {
            this.logger.error(err)
            return ApiResponse.internalServerError()
        }
    }

    async updateGroup(id: string, groupDetails: BaseGroup, authDetails: AuthDetails): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`working on updateGroup method in groupServiceImpl \n with group details ${JSON.stringify(groupDetails)} and group id : ${id}`);
            const isValidId = GroupIdSchema.safeParse(Number(id));
            if (!isValidId.success) {
                this.logger.info(JSON.stringify(isValidId.error));
                return ApiResponse.badRequest(GroupMessages.getErrorMessage(isValidId.error.issues));
            }
            let isValidDetails = BaseGroupSchema.safeParse(groupDetails);
            if (!isValidDetails.success) {
                this.logger.info(JSON.stringify(isValidDetails.error));
                return ApiResponse.badRequest(GroupMessages.getErrorMessage(isValidDetails.error.issues));
            }
            let group: any = await this.groupRepository.getGroupById(Number(id));
            this.logger.info(`isExist ${JSON.stringify(group)}`)
            if (!group) {
                this.logger.info(JSON.stringify(GroupMessages.failure.invalidId));
                return ApiResponse.badRequest(GroupMessages.failure.invalidId);
            }
            const baseDetails: BaseList = {
                isDeleted: group[0].isDeleted,
                createdBy: group[0].createdBy,
                createdOn: getFormattedDateTime(new Date(group[0].createdOn)),
                updatedBy: authDetails.userId,
                updatedOn: getCurrentFormattedDateTime(),
            };
            const updatedGroup = await this.groupRepository.updateGroup(Number(id), isValidDetails.data, baseDetails);
            this.logger.info("updated Group : " + JSON.stringify(updatedGroup));
            if (!updatedGroup) {
                this.logger.info(GroupMessages.failure.invalidId);
                return ApiResponse.badRequest(GroupMessages.failure.invalidId);
            }
            return ApiResponse.updated(null, GroupMessages.success.updated)
        }
        catch (error) {
            this.logger.error(error);
            return ApiResponse.internalServerError();
        }
    }

    async deleteGroup(id: number, authDetails: AuthDetails): Promise<ApiResponse> {
        try {
            const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
            await delay(2000)
            this.logger.info(`working on deleteGroup method in groupServiceImpl \n with group id : ${id}`);
            const isValidId = GroupIdSchema.safeParse(Number(id));
            if (!isValidId.success) {
                this.logger.info(JSON.stringify(isValidId.error));
                return ApiResponse.badRequest(GroupMessages.getErrorMessage(isValidId.error.issues));
            }
            let groupDetails: any = await this.groupRepository.getGroupById(Number(id));
            this.logger.info(`isExist ${JSON.stringify(groupDetails)}`);
            if (groupDetails.length < 1) {
                this.logger.info(JSON.stringify(GroupMessages.failure.invalidId));
                return ApiResponse.badRequest(GroupMessages.failure.invalidId);
            }
            const baseDetails: BaseList = {
                isDeleted: 1,
                createdBy: groupDetails[0].createdBy,
                createdOn: getFormattedDateTime(new Date(groupDetails[0].createdOn)),
                updatedBy: authDetails.userId,
                updatedOn: getCurrentFormattedDateTime(),
            };
            const deleteGroup = await this.groupRepository.deleteGroup(id, groupDetails[0], baseDetails);
            this.logger.info("Result from groupRepository.deleteGroup : " + JSON.stringify(deleteGroup));
            if (!deleteGroup) {
                this.logger.info(GroupMessages.failure.invalidId);
                return ApiResponse.badRequest(GroupMessages.failure.invalidId);
            }
            return ApiResponse.deleted(GroupMessages.success.deleted)
        }
        catch (error) {
            this.logger.error(error);
            return ApiResponse.internalServerError();
        }
    }
}
