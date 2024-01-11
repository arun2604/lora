import { z } from "zod";
import { BaseListSchema } from "./baseModel";
import { UserRoleMessage } from "../const/userRole/userRoleMessage";

export const UserRoleSchema = z.object({
  name: z
    .string({
      invalid_type_error: UserRoleMessage._name.invalidType,
      required_error: UserRoleMessage._name.required,
    })
    .trim()
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), { message: UserRoleMessage._name.invalid }),
  permissions: z
    .array(
      z.object({
        permissionId: z.number({
          required_error: "Permission id required",
          invalid_type_error: '"Permission id must be number"',
        }),
        isDeleted: z.literal(0).or(z.literal(1).or(z.boolean())).optional(),
      }),
    )
    .refine((value) => value.length > 0, { message: "Minimum one permission required" }),
});

export type UserRole = z.infer<typeof UserRoleSchema>;

export const BaseUserRoleSchema = z.object({
  name: z
    .string({
      invalid_type_error: UserRoleMessage._name.invalidType,
      required_error: UserRoleMessage._name.required,
    })
    .trim()
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), { message: UserRoleMessage._name.invalid }),
});

export type BaseUserRole = z.infer<typeof BaseUserRoleSchema>;

export const UserRoleIdSchema = z.number().positive();

export type UserRoleId = z.infer<typeof UserRoleIdSchema>;

export const UserRoleListSchema = BaseUserRoleSchema.extend({
  userRoleId: z.number(),
  normalizedName: z.string(),
}).merge(BaseListSchema);

export type UserRoleList = z.infer<typeof UserRoleListSchema>;
