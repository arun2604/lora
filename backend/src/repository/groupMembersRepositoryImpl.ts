import Container, { Service } from "typedi";
import { RowDataPacket } from "mysql2";
import { Logger } from "winston";
import { IDatabaseManager } from "../context/database/databaseManager";
import { IGroupMemberRepository } from "../context/groupMembers/groupMemberRepository";
import { BaseGroupMembers, GroupMemberDetails, GroupMemberId, GroupMemberList } from "../model/groupMembers";
import { AppLogger } from "../logger";
import { GroupMemberQuery } from "../const/groupMembers/groupMemberQuery";
import { BaseList } from "../model/baseModel";

@Service(IGroupMemberRepository.identity)
export class GroupMembersRepoSitoryImpl extends IGroupMemberRepository {
    database: IDatabaseManager = Container.get(IDatabaseManager.identity);
    logger: Logger = AppLogger.getInstance().getLogger(__filename);
    groupMemberQuery = new GroupMemberQuery();

    convertPascalToCamelCase(rows: RowDataPacket[]): GroupMemberDetails[] {
        return rows.map((groupMember) => ({
            groupMemberId: groupMember.GroupMemberId,
            groupId: groupMember.GroupId,
            deviceId: groupMember.DeviceId,
            deviceName: groupMember.DeviceName,
            isDeleted: groupMember.IsDeleted,
            createdBy: groupMember.CreatedBy,
            createdOn: groupMember.CreatedOn,
            updatedBy: groupMember.UpdatedBy,
            updatedOn: groupMember.UpdatedOn,
        }));
    }

    async getGroupMembers(): Promise<GroupMemberList[] | undefined> {
        try {
            this.logger.info(`Working on getGroupMembers method  in groupMembersRepositoryImpl`);
            const groupMembersList: GroupMemberList[] = await this.database.executeGetQuery(this.groupMemberQuery.findAll());
            this.logger.info("Result from groupMemberQuery.findAll query : " + JSON.stringify(groupMembersList));
            return groupMembersList
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async getGroupMembersById(id: number): Promise<GroupMemberList[] | undefined> {
        try {
            this.logger.info(`working on getGroupMembersById with id ${id}`);
            let groupMembers: any = await this.database.executeRunQuery(this.groupMemberQuery.findById(id));
            this.logger.info(`Result from findById : ${JSON.stringify(groupMembers)}`);
            let convertedgroup: GroupMemberList[] = this.convertPascalToCamelCase(groupMembers)
            return convertedgroup
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async getGroupMembersByGroupId(id: number): Promise<{ groupId: number; deviceId: number; groupMemberId: number; isDeleted: boolean | 0 | 1; createdBy: number; createdOn: string; updatedBy: number | null; updatedOn: string | null; }[] | undefined> {
        try {
            this.logger.info(`working on getGroupMembersByGroupId with id ${id}`);
            let groupMembers: any = await this.database.executeRunQuery(this.groupMemberQuery.findByGroupId(id));
            this.logger.info(`Result from findById  in getGroupMembersByGroupId: ${JSON.stringify(groupMembers)}`);
            let convertedgroup: GroupMemberList[] = this.convertPascalToCamelCase(groupMembers)
            return convertedgroup
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async getGroupMembersByGroupDeviceId(groupId: number, deviceId: number): Promise<GroupMemberList[] | undefined> {
        try {
            this.logger.info(`working on getGroupMembersByGroupDeviceId with groupId ${groupId} and deviceId ${deviceId}`);
            let groupMembers: any = await this.database.executeRunQuery(this.groupMemberQuery.findByGroupDeviceId(groupId, deviceId));
            this.logger.info(`Result from findByGroupDeviceId : ${JSON.stringify(groupMembers)}`);
            let convertedgroup: GroupMemberList[] = this.convertPascalToCamelCase(groupMembers)
            return convertedgroup;
        }
        catch (error) {
            this.logger.error(error)
        }
    }
    async createGroupMember(groupMemberDetails: BaseGroupMembers, baseDetails: BaseList): Promise<GroupMemberList[] | undefined> {
        try {
            this.logger.info(`working on createGroupMember repository with details ${JSON.stringify(groupMemberDetails)}`)
            await this.database.executeStartTransactionQuery();
            const result = await this.database.executeRunQuery(this.groupMemberQuery.createQuery(groupMemberDetails, baseDetails))
            this.logger.info(`Result from  createQuery : ${JSON.stringify(result)}`)
            if (result.insertId <= 0) {
                return;
            }
            const id = result.insertId;
            let historyResult = await this.database.executeRunQuery(this.groupMemberQuery.createHistoryQuery(id, groupMemberDetails, baseDetails))
            this.logger.info(`History result  from createGroupMember : ${JSON.stringify(historyResult)}`)
            if (historyResult.insertId <= 0) {
                return;
            }
            await this.database.executeCommitQuery();
            const createdMember: any = await this.getGroupMembersById(id)
            this.logger.info(`Result from getGroupMembersById : ${JSON.stringify(createdMember)}`);
            let convertedMember: GroupMemberList[] = this.convertPascalToCamelCase(createdMember);
            return convertedMember;
        }
        catch (error) {
            this.logger.error(error)
        }
    }
    async updateGroupMember(id: number, groupMemberDetails: BaseGroupMembers, baseDetails: BaseList): Promise<GroupMemberList[] | undefined> {
        try {
            this.logger.info(`wprking on updateGroupMember repository with member id : ${id} \n member details : ${JSON.stringify(groupMemberDetails)} \n and basicDetails ${JSON.stringify(baseDetails)} `)
            await this.database.executeStartTransactionQuery();
            const result = await this.database.executeRunQuery(this.groupMemberQuery.updateQuery(id, groupMemberDetails, baseDetails))
            this.logger.info(`Result from updateQuery : ${JSON.stringify(result)}`)
            if (result.affectedRows <= 0) {
                return;
            }
            let historyResult = await this.database.executeRunQuery(this.groupMemberQuery.createHistoryQuery(id, groupMemberDetails, baseDetails))
            this.logger.info(`History result  from createGroupMember : ${JSON.stringify(historyResult)}`)
            if (historyResult.insertId <= 0) {
                return;
            }
            await this.database.executeCommitQuery();
            const updatedMember: any = await this.getGroupMembersById(id)
            this.logger.info(`Result from getGroupMembersById : ${JSON.stringify(updatedMember)}`);
            let convertedMember: GroupMemberList[] = this.convertPascalToCamelCase(updatedMember);
            return convertedMember;
        }
        catch (error) {
            this.logger.info(error)
        }
    }
    async deleteGroupmember(id: number, groupMemberDetails: BaseGroupMembers, baseDetails: BaseList): Promise<string | undefined> {
        try {
            this.logger.info(`working on deleteGroupMember with id: ${id} and details: ${JSON.stringify(groupMemberDetails)} \n ${JSON.stringify(baseDetails)} in groupMemberRepositoryImpl`)
            await this.database.executeStartTransactionQuery();
            const result = await this.database.executeRunQuery(this.groupMemberQuery.deleteQuery(id, baseDetails))
            this.logger.info(`Result from groupMemberQuery.deleteQuery : ${JSON.stringify(result)}`);
            if (result.affectedRows <= 0) {
                return;
            }
            let historyResult = await this.database.executeRunQuery(this.groupMemberQuery.createHistoryQuery(id, groupMemberDetails, baseDetails))
            this.logger.info(`History result  from createGroupMember : ${JSON.stringify(historyResult)}`)
            if (historyResult.insertId <= 0) {
                return;
            }
            await this.database.executeCommitQuery();
            return "Group member deleted";
        }
        catch (error) {
            this.logger.error(error);
        }
    }
}