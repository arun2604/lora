import { AuthDetails, BaseList } from "../../model/baseModel";
import { BaseGroupMembers, GroupMemberList } from "../../model/groupMembers";

export abstract class IGroupMemberRepository {
    static identity: string = "IGroupMembersRepository";

    abstract getGroupMembers(): Promise<GroupMemberList[] | undefined>;
    abstract getGroupMembersById(id: number): Promise<GroupMemberList[] | undefined>;
    abstract getGroupMembersByGroupId(id: number): Promise<GroupMemberList[] | undefined>;
    abstract getGroupMembersByGroupDeviceId(groupId: number, deviceId: number): Promise<GroupMemberList[] | undefined>
    abstract createGroupMember(groupMemberDetails: BaseGroupMembers, baseDetails: BaseList): Promise<GroupMemberList[] | undefined>
    abstract updateGroupMember(id: number, groupMemberDetails: BaseGroupMembers, baseDetails: BaseList): Promise<GroupMemberList[] | undefined>
    abstract deleteGroupmember(id: number, groupMemberDetails: BaseGroupMembers, baseDetails: BaseList): Promise<string | undefined>
}