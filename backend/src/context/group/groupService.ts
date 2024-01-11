import { BaseGroup } from "../../model/group";
import ApiResponse from "../../utilities/apiResponse";

export abstract class IGroupService {
    static identity: string = "IGroupService";

    abstract getGroups(): Promise<ApiResponse>;
    abstract getGroupById(id: number): Promise<ApiResponse>;
    abstract getGroupDetails(id: number): Promise<ApiResponse>;
    abstract createGroups(groupDetails: BaseGroup, authDetails: Express.Locals): Promise<ApiResponse>;
    abstract updateGroup(id: string, groupDetails: BaseGroup, authDetails: Express.Locals): Promise<ApiResponse>;
    abstract updateGroupAndMembers(id: string, groupDetails: any, authDetails: Express.Locals): Promise<ApiResponse>;
    abstract deleteGroup(id: number, authDetails: Express.Locals): Promise<ApiResponse>;
}
