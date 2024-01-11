import { Logger } from "winston";
import { AppLogger } from "../../logger";
import { BaseGroup, GroupId } from "../../model/group";
import { BaseDetails, BaseList } from "../../model/baseModel";

export class GroupQuery {
    logger: Logger = AppLogger.getInstance().getLogger(__filename);
    tableName = "device_group";
    groupId = "GroupId";
    name = "Name";
    companyId = "CompanyId";
    normalizedName = "NormalizedName";
    isDeleted = "IsDeleted";
    createdBy = "CreatedBy";
    createdOn = "CreatedOn";
    updatedBy = "UpdatedBy";
    updatedOn = "UpdatedOn";
    historyTableName = "device_group_history";

    findAll(): string {
        const query = `SELECT * FROM ${this.tableName} WHERE ${this.isDeleted} = 0`;
        this.logger.info(`Find all Group query : ${query}`);
        return query;
    }
    findById(id: number): string {
        const query = `SELECT * FROM ${this.tableName} WHERE ${this.groupId} = ${id} AND ${this.isDeleted} = false`
        this.logger.info(`findById query ${query}`);
        return query;
    }
    findByName(name: string): string {
        const query = `SELECT * FROM ${this.tableName} WHERE ${this.normalizedName} = '${name.toUpperCase()}' AND ${this.isDeleted} = 0`
        this.logger.info(`findById query ${query}`);
        return query;
    }
    createQuery(groupDetails: BaseGroup, baseDetails: BaseDetails, normalizedName: string): string {
        const query = `INSERT INTO ${this.tableName} (${this.companyId},${this.name} , ${this.normalizedName} ,
             ${this.isDeleted} , ${this.createdBy} , ${this.createdOn}) VALUES ('${baseDetails.companyId}','${groupDetails.name}',
            '${normalizedName}', ${baseDetails.isDeleted} ,${baseDetails.createdBy} , 
            '${baseDetails.createdOn}')`;
        this.logger.info(`Create group query ${query}`);
        return query;
    }
    updateQuery(id: GroupId, groupDetails: BaseGroup, baseDetails: BaseList, normalizedName: string): string {
        const query = `UPDATE ${this.tableName} SET ${this.name} = '${groupDetails.name}',
        ${this.normalizedName} = '${normalizedName}',
        ${this.updatedBy} = ${baseDetails.updatedBy}, ${this.updatedOn} = '${baseDetails.updatedOn}'
        WHERE ${this.groupId} = ${id}`;
        this.logger.info(`Update group query ${query} `);
        return query;
    }
    createHistoryQuery(id: number, groupDetails: BaseGroup, baseDetails: BaseList, normalizedName: string): string {
        const query = `INSERT INTO ${this.historyTableName} (${this.groupId},${this.name} , ${this.normalizedName} ,
             ${this.isDeleted} , ${this.createdBy} , ${this.createdOn}) VALUES (${id},'${groupDetails.name}',
            '${normalizedName}', ${baseDetails.isDeleted} ,${baseDetails.createdBy} , '${baseDetails.createdOn}')`
        this.logger.info(`Create group query ${query}`);
        return query;
    }
    deleteQuery(id: number, baseDetails: BaseList): string {
        const query = `UPDATE ${this.tableName} SET ${this.isDeleted} = ${baseDetails.isDeleted},
         ${this.updatedBy} = ${baseDetails.updatedBy}, ${this.updatedOn} = '${baseDetails.updatedOn}'
         WHERE ${this.groupId} = ${id}`;
        this.logger.info(`delete group query  ${query}`);
        return query;
    }
}
