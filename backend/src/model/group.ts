import { z } from "zod";
import { BaseListSchema } from "./baseModel";
import { GroupMessages } from "../const/group/groupMessage";

export const BaseGroupSchema = z.object({
    name: z
        .string({
            invalid_type_error: GroupMessages.groupName.invalidType,
            required_error: GroupMessages.groupName.required,
        })
        .trim()
        .min(3, GroupMessages.groupName.minimumCharacter),
})

export type BaseGroup = z.infer<typeof BaseGroupSchema>;

export const GroupIdSchema = z.number().positive();

export type GroupId = z.infer<typeof GroupIdSchema>;

export const GroupListSchema = BaseGroupSchema.extend({
    groupId: z.number(),
    normalizedName: z.string()
}).merge(BaseListSchema)



export type GroupList = z.infer<typeof GroupListSchema>;
