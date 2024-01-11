import { z } from "zod";
import { LoginMessage } from "../const/login/loginMessage";

export const LoginSchema = z.object({
  email: z
    .string({
      invalid_type_error: LoginMessage.email.invalidType,
      required_error: LoginMessage.email.required,
    })
    .trim()
    .email(LoginMessage.email.invalid),
  password: z
    .string({
      invalid_type_error: LoginMessage.password.invalidType,
      required_error: LoginMessage.password.required,
    })
    .trim()
    .refine((value) => /^\d+$/.test(value), {
      message: LoginMessage.password.digits,
    }),
});

export type EmailLogin = z.infer<typeof LoginSchema>;

export type PayLoad = { userId: number; companyId: number; loggedOn: Date };
