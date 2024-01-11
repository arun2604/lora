import { z } from "zod";
import { BaseListSchema } from "./baseModel";
import { CompanyMessage } from "../const/company/companyMessage";

export const BaseCompanySchema = z.object({
  name: z
    .string({
      invalid_type_error: CompanyMessage._name.invalidType,
      required_error: CompanyMessage._name.required,
    })
    .trim()
    .min(3, CompanyMessage._name.minimumCharacter),
  email: z
    .string({
      invalid_type_error: CompanyMessage.email.invalidType,
      required_error: CompanyMessage.email.required,
    })
    .trim()
    .email(CompanyMessage.email.invalid),
  mobileNumber: z
    .string({
      invalid_type_error: CompanyMessage.mobileNumber.invalidType,
      required_error: CompanyMessage.mobileNumber.required,
    })
    .trim()
    .length(10, CompanyMessage.mobileNumber.invalid),
  landmark: z
    .string({
      invalid_type_error: CompanyMessage.landmark.invalidType,
      required_error: CompanyMessage.landmark.required,
    })
    .trim()
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), { message: CompanyMessage.landmark.invalid }),
  city: z
    .string({
      invalid_type_error: CompanyMessage.city.invalidType,
      required_error: CompanyMessage.city.required,
    })
    .trim()
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), { message: CompanyMessage.city.invalid }),
  state: z
    .string({
      invalid_type_error: CompanyMessage.state.invalidType,
      required_error: CompanyMessage.state.required,
    })
    .trim()
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), { message: CompanyMessage.state.invalid }),
  country: z
    .string({
      invalid_type_error: CompanyMessage.country.invalidType,
      required_error: CompanyMessage.country.required,
    })
    .trim()
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), { message: CompanyMessage.country.invalid }),
  zipCode: z
    .string({
      invalid_type_error: CompanyMessage.zipCode.invalidType,
      required_error: CompanyMessage.zipCode.required,
    })
    .trim()
    .length(6, CompanyMessage.zipCode.invalid)
    .refine((value) => /^\d+$/.test(value), {
      message: CompanyMessage.zipCode.digits,
    }),
});

export type BaseCompany = z.infer<typeof BaseCompanySchema>;

export const CompanyIdSchema = z.number().positive();

export type CompanyId = z.infer<typeof CompanyIdSchema>;

export const CompanyListSchema = BaseCompanySchema.extend({ companyId: z.number(), normalizedName: z.string() }).merge(
  BaseListSchema,
);

export type CompanyList = z.infer<typeof CompanyListSchema>;
