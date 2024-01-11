import Container, { Service } from "typedi";
import { RowDataPacket } from "mysql2";
import { Logger } from "winston";
import { IDatabaseManager } from "../context/database/databaseManager";
import { IGroupRepository } from "../context/group/groupRepository";
import { BaseGroup, GroupId, GroupList } from "../model/group";
import { AppLogger } from "../logger";
import { GroupQuery } from "../const/group/groupQuery";
import { BaseDetails, BaseList } from "../model/baseModel";
import { IGroupMemberRepository } from "../context/groupMembers/groupMemberRepository";

@Service(IGroupRepository.identity)
export class GroupRepoSitoryImpl extends IGroupRepository {
    database: IDatabaseManager = Container.get(IDatabaseManager.identity);
    logger: Logger = AppLogger.getInstance().getLogger(__filename);
    groupQuery = new GroupQuery();

    convertPascalToCamelCase(rows: RowDataPacket[]): GroupList[] {
        return rows.map((group) => ({
            groupId: group.GroupId,
            name: group.Name,
            normalizedName: group.NormalizedName,
            isDeleted: group.IsDeleted,
            createdBy: group.CreatedBy,
            createdOn: group.CreatedOn,
            updatedBy: group.UpdatedBy,
            updatedOn: group.UpdatedOn,
        }));
    }

    async getGroups(): Promise<GroupList[] | undefined> {
        try {
            this.logger.info(`Working on getGroups method  in groupRepositoryImpl`);
            const groupsList: GroupList[] = await this.database.executeGetQuery(this.groupQuery.findAll());
            this.logger.info("Result from findAll query : " + JSON.stringify(groupsList));
            return groupsList
        }
        catch (error) {
            this.logger.error(error);
        }
    }

    async getGroupById(id: number): Promise<GroupList[] | undefined> {
        try {
            this.logger.info(`working on findById with id ${id}`);
            let group: any = await this.database.executeRunQuery(this.groupQuery.findById(id));
            this.logger.info(`Result from findById : ${JSON.stringify(group)}`);
            let convertedgroup: GroupList[] = this.convertPascalToCamelCase(group)
            return convertedgroup
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async getGroupByName(name: string): Promise<GroupList[] | undefined> {
        try {
            this.logger.info(`working on getGroupByName in groupRepositoryImpl with group name ${name}`)
            let group: any = await this.database.executeGetQuery(this.groupQuery.findByName(name))
            this.logger.info(`Result from findByName is : ${JSON.stringify(group)}`);
            let convertedgroup: GroupList[] = this.convertPascalToCamelCase(group)
            return convertedgroup;
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async createGroups(groupDetails: BaseGroup, baseDetails: BaseDetails): Promise<GroupList | undefined> {
        try {
            this.logger.info(`working on createGroups with ${JSON.stringify(groupDetails)} \n ${JSON.stringify(baseDetails)} in groupRepositoryImpl`)
            await this.database.executeStartTransactionQuery();
            const normalizedName = groupDetails.name.toUpperCase();
            let result = await this.database.executeRunQuery(this.groupQuery.createQuery(groupDetails, baseDetails, normalizedName))
            this.logger.info(`Result from  createQuery : ${JSON.stringify(result)}`)
            if (result.insertId <= 0) {
                return;
            }
            const id = result.insertId;
            let historyResult = await this.database.executeRunQuery(this.groupQuery.createHistoryQuery(id, groupDetails, baseDetails, normalizedName))
            this.logger.info(`History result  from createGroups : ${JSON.stringify(historyResult)}`)
            if (historyResult.insertId <= 0) {
                return;
            }
            await this.database.executeCommitQuery();
            let newGroup: any = await this.getGroupById(result.insertId);
            this.logger.info(`Created group : ${JSON.stringify(newGroup)}`);
            return newGroup
        } catch (error) {
            this.logger.error(error);
        }
    }

    async updateGroup(id: number, groupDetails: BaseGroup, baseDetails: BaseList): Promise<GroupList | undefined> {
        try {
            this.logger.info(`working on updateGroup with id: ${id} and details: ${JSON.stringify(groupDetails)} \n ${JSON.stringify(baseDetails)} in groupRepositoryImpl`)
            await this.database.executeStartTransactionQuery();
            let normalizedName = groupDetails.name.toUpperCase();
            let result = await this.database.executeRunQuery(this.groupQuery.updateQuery(id, groupDetails, baseDetails, normalizedName));
            this.logger.info(`Result from  updateQuery : ${JSON.stringify(result)}`);
            if (result.affectedRows <= 0) {
                return;
            }
            let historyResult = await this.database.executeRunQuery(this.groupQuery.createHistoryQuery(id, groupDetails, baseDetails, normalizedName))
            this.logger.info(`History result  from createHistoryQuery : ${JSON.stringify(historyResult)}`)
            if (historyResult.insertId <= 0) {
                return;
            }
            await this.database.executeCommitQuery();
            let updatedgroup: any = await this.getGroupById(id);
            this.logger.info(`Updated group : ${JSON.stringify(updatedgroup)}`);
            return updatedgroup;
        }
        catch (error) {
            this.logger.error(error)
        }
    }
    async deleteGroup(id: number, groupDetails: BaseGroup, baseDetails: BaseList): Promise<string | undefined> {
        try {
            this.logger.info(`working on deleteGroup with id: ${id} and details: ${JSON.stringify(groupDetails)} \n ${JSON.stringify(baseDetails)} in groupRepositoryImpl`)
            await this.database.executeStartTransactionQuery();
            const result = await this.database.executeRunQuery(this.groupQuery.deleteQuery(id, baseDetails))
            this.logger.info(`Result from groupQuery.deleteQuery : ${JSON.stringify(result)}`);
            if (result.affectedRows <= 0) {
                return;
            }
            let normalizedName = groupDetails.name.toUpperCase()
            let historyResult = await this.database.executeRunQuery(this.groupQuery.createHistoryQuery(id, groupDetails, baseDetails, normalizedName))
            this.logger.info(`History result  from createHistoryQuery : ${JSON.stringify(historyResult)}`)
            if (historyResult.insertId <= 0) {
                return;
            }
            await this.database.executeCommitQuery();
            return "Group deleted"
        }
        catch (error) {
            this.logger.error(error)
        }
    }
}