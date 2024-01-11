import { z } from "zod";
import { BaseListSchema } from "./baseModel";
import { PermissionMessage } from "../const/permission/permissionMessage";

export const BasePermissionSchema = z.object({
  name: z
    .string({
      invalid_type_error: PermissionMessage._name.invalidType,
      required_error: PermissionMessage._name.required,
    })
    .trim()
    .refine((value) => /^[a-zA-Z_\s]+$/.test(value), { message: PermissionMessage._name.invalid }),
});

export type BasePermission = z.infer<typeof BasePermissionSchema>;

export const PermissionIdSchema = z.number().positive();

export type PermissionId = z.infer<typeof PermissionIdSchema>;

export const PermissionSchema = BasePermissionSchema.extend({
  permissionId: z.number(),
  normalizedName: z.string(),
});

export type Permission = z.infer<typeof PermissionSchema>;

export const PermissionListSchema = PermissionSchema.merge(BaseListSchema);

export type PermissionList = z.infer<typeof PermissionListSchema>;
