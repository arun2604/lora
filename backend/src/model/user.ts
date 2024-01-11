import { z } from "zod";
import { BaseListSchema } from "./baseModel";
import { UserMessage } from "../const/user/userMessage";

export const BaseUserSchema = z.object({
  userRoleId: z
    .number({
      invalid_type_error: UserMessage.userRoleId.invalidType,
      required_error: UserMessage.userRoleId.required,
    })
    .positive(UserMessage.userRoleId.invalid),
  name: z
    .string({
      invalid_type_error: UserMessage._name.invalidType,
      required_error: UserMessage._name.required,
    })
    .trim()
    .min(3, UserMessage._name.minimumCharacter)
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), { message: UserMessage._name.invalid }),
  email: z
    .string({
      invalid_type_error: UserMessage.email.invalidType,
      required_error: UserMessage.email.required,
    })
    .trim()
    .email(UserMessage.email.invalid),
  password: z
    .string({
      invalid_type_error: UserMessage.password.invalidType,
      required_error: UserMessage.password.required,
    })
    .trim()
    .min(8, UserMessage.password.minimumCharacter)
    .refine((value) => /^\d+$/.test(value), {
      message: UserMessage.password.digits,
    }),
  mobileNumber: z
    .string({
      invalid_type_error: UserMessage.mobileNumber.invalidType,
      required_error: UserMessage.mobileNumber.required,
    })
    .trim()
    .length(10, UserMessage.mobileNumber.invalid)
    .refine((value) => /^\d+$/.test(value), {
      message: UserMessage.mobileNumber.digits,
    }),
});

export type BaseUser = z.infer<typeof BaseUserSchema>;

export const UserIdSchema = z.number().positive();

export type UserId = z.infer<typeof UserIdSchema>;

export const UserSchema = BaseUserSchema.merge(
  z.object({
    userId: z.number().positive(),
    companyId: z.number().positive(),
    normalizedName: z.string(),
    normalizedEmail: z.string(),
    isEmailConfirmed: z.literal(0).or(z.literal(1).or(z.boolean())),
    isMobileNumberConfirmed: z.literal(0).or(z.literal(1).or(z.boolean())),
    isActive: z.literal(0).or(z.literal(1).or(z.boolean())),
  }),
);

export type User = z.infer<typeof UserSchema>;

export const UserListSchema = UserSchema.merge(BaseListSchema).merge(
  z.object({
    companyName: z.string(),
    companyNormalizedName: z.string(),
    userRoleName: z.string(),
    userRoleNormalizedName: z.string(),
  }),
);

export type UserList = z.infer<typeof UserListSchema>;
