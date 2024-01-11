import { Logger } from "winston";
import { AppLogger } from "../../logger";
import { BaseGroupMembers, GroupMemberId } from "../../model/groupMembers";
import { BaseList } from "../../model/baseModel";

export class GroupMemberQuery {
    logger: Logger = AppLogger.getInstance().getLogger(__filename);
    tableName = "device_group_members";
    groupId = "GroupId";
    groupMemberId = "GroupMemberId";
    deviceId = "DeviceId"
    isDeleted = "IsDeleted";
    createdBy = "CreatedBy";
    createdOn = "CreatedOn";
    updatedBy = "UpdatedBy";
    updatedOn = "UpdatedOn";
    historyTableName = "device_group_members_history";

    findAll(): string {
        const query = `SELECT * FROM device_group_members WHERE device_group_members.IsDeleted =0`;
        this.logger.info(`Find all Group query : ${query}`);
        return query;
    }
    findById(id: number): string {
        const query = `SELECT * FROM ${this.tableName} WHERE ${this.groupMemberId} = ${id} AND ${this.isDeleted} = false`
        this.logger.info(`findById query ${query}`)
        return query;
    }
    findByGroupId(id: number): string {
        const query = `SELECT ${this.tableName}.*, 
        d.Name AS 'DeviceName'
        FROM ${this.tableName} JOIN device as d
        ON ${this.tableName}.${this.deviceId} = d.${this.deviceId}
        WHERE ${this.tableName}.${this.groupId} = ${id} AND ${this.tableName}.${this.isDeleted} = false`
        this.logger.info(`findByGroupId query ${query}`)
        return query;
    }
    findByGroupDeviceId(groupId: number, deviceId: number): string {
        const query = `SELECT * FROM ${this.tableName} 
        WHERE ${this.groupId} = ${groupId} AND ${this.deviceId} = ${deviceId} AND ${this.isDeleted} = false`
        this.logger.info(`findByGroupDeviceId query ${query}`)
        return query;
    }
    createQuery(groupDetails: BaseGroupMembers, baseDetails: BaseList): string {
        const query = `INSERT INTO ${this.tableName} (${this.groupId} , ${this.deviceId} ,
             ${this.isDeleted} , ${this.createdBy} , ${this.createdOn}) VALUES ('${groupDetails.groupId}',
            '${groupDetails.deviceId}', ${baseDetails.isDeleted},${baseDetails.createdBy},'${baseDetails.createdOn}')`
        this.logger.info(`Create group member query ${query}`)
        return query;
    }
    updateQuery(id: GroupMemberId, groupDetails: BaseGroupMembers, baseDetails: BaseList): string {
        const query = `UPDATE ${this.tableName} SET ${this.groupId} = '${groupDetails.groupId}',
        ${this.deviceId} = '${groupDetails.deviceId}',
        ${this.updatedBy} = ${baseDetails.updatedBy}, ${this.updatedOn} = '${baseDetails.updatedOn}'
        WHERE ${this.groupMemberId} = ${id} AND ${this.isDeleted} = false`
        this.logger.info(`Update group query ${query} `)
        return query;
    }
    createHistoryQuery(id: number, groupDetails: BaseGroupMembers, baseDetails: BaseList): string {
        const query = `INSERT INTO ${this.historyTableName} (${this.groupMemberId},${this.groupId} , ${this.deviceId} ,
             ${this.isDeleted} , ${this.createdBy} , ${this.createdOn}) VALUES (${id},'${groupDetails.groupId}',
            '${groupDetails.deviceId}', ${baseDetails.isDeleted} ,${baseDetails.createdBy} , '${baseDetails.createdOn}')`
        this.logger.info(`Create group member history query ${query}`)
        return query;
    }
    deleteQuery(id: number, baseDetails: BaseList): string {
        const query = `UPDATE ${this.tableName} SET ${this.isDeleted} = ${baseDetails.isDeleted},
         ${this.updatedBy} = ${baseDetails.updatedBy}, ${this.updatedOn} = '${baseDetails.updatedOn}'
         WHERE ${this.groupMemberId} = ${id}`;
        this.logger.info(`Delete group member Query : ${query}`)
        return query;
    }
}
