import { BaseList } from "../../model/baseModel";
import { BaseGroup } from "../../model/group";
import { BaseGroupMembers, GroupMemberList, MultipleMemberAdd } from "../../model/groupMembers";
import ApiResponse from "../../utilities/apiResponse";

export abstract class IGroupMemberService {
    static identity: string = "IGroupMembersService";

    abstract getGroupMembers(): Promise<ApiResponse>;
    abstract getGroupMemberById(id: number): Promise<ApiResponse>;
    abstract getGroupMemberByGroupId(id: number): Promise<ApiResponse>;
    abstract getGroupMemberNotInGroup(id: number): Promise<ApiResponse>;
    abstract createGroupMember(groupMemberDetails: BaseGroupMembers, authDetails: Express.Locals): Promise<ApiResponse>
    abstract createMulltipleGroupMember(groupMemberDetails: MultipleMemberAdd, authDetails: Express.Locals): Promise<ApiResponse>
    abstract updateGroupMember(id: number, groupMemberDetails: BaseGroupMembers, authDetails: Express.Locals): Promise<ApiResponse>
    abstract deleteGroupMember(id: number, authDetails: Express.Locals): Promise<ApiResponse>
}