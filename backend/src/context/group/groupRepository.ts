import { BaseGroup, GroupId, GroupList } from "../../model/group";
import { AuthDetails, BaseList } from "../../model/baseModel";

export abstract class IGroupRepository {
    static identity: string = "IGroupRepository";

    abstract getGroups(): Promise<GroupList[] | undefined>;
    abstract getGroupByName(name: string): Promise<GroupList[] | undefined>;
    abstract getGroupById(id: number): Promise<GroupList[] | undefined>;
    abstract createGroups(
        groupDetails: BaseGroup, baseDetails: BaseList
    ): Promise<GroupList | undefined>;
    abstract updateGroup(
        id: number,
        groupDetails: BaseGroup, baseDetails: BaseList
    ): Promise<GroupList | undefined>;
    abstract deleteGroup(id: number, groupDetails: BaseGroup, baseDetails: BaseList): Promise<string | undefined>
}