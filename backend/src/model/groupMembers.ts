import { z } from "zod";
import { BaseListSchema } from "./baseModel";
import { GroupMembersMessages } from "../const/groupMembers/groupMembersMessage";

export const BaseGroupMembersSchema = z.object({
    groupId: z
        .number({
            invalid_type_error: GroupMembersMessages.groupId.invalidType,
            required_error: GroupMembersMessages.groupId.required,
        })
        .positive(GroupMembersMessages.groupId.invalid),
    deviceId: z
        .number({
            invalid_type_error: GroupMembersMessages.deviceId.invalidType,
            required_error: GroupMembersMessages.deviceId.required,
        })
        .positive(GroupMembersMessages.deviceId.invalid),
})

export type BaseGroupMembers = z.infer<typeof BaseGroupMembersSchema>;

export const GroupMemberListSchema = BaseGroupMembersSchema.extend({
    groupMemberId: z.number()
}).merge(BaseListSchema)

export const GroupMemberDetailsSchema = GroupMemberListSchema.extend({
    deviceName: z.string()
}).merge(BaseListSchema)

export const GroupMembersIdSchema = z.number().positive();

export type GroupMemberId = z.infer<typeof GroupMembersIdSchema>;

export type GroupMemberList = z.infer<typeof GroupMemberListSchema>;

export type GroupMemberDetails = z.infer<typeof GroupMemberDetailsSchema>;


export const MultipleMemberAddSchema = z.object({
    groupId: z
        .number({
            invalid_type_error: GroupMembersMessages.groupId.invalidType,
            required_error: GroupMembersMessages.groupId.required,
        })
        .positive(GroupMembersMessages.groupId.invalid),
    selectedDevices: z
        .array(
            z
                .number({
                    invalid_type_error: GroupMembersMessages.groupId.invalidType,
                    required_error: GroupMembersMessages.groupId.required,
                })
                .positive(GroupMembersMessages.groupId.invalid)
        )
        .min(1, 'At least one member is required'),
})

export type MultipleMemberAdd = z.infer<typeof MultipleMemberAddSchema>;
