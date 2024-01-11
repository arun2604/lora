import { z } from "zod";
import { BaseListSchema } from "./baseModel";
import { GatewayMessage } from "../const/gateway/gatewayMessage";

export const BaseGatewaySchema = z.object({
  name: z
    .string({
      invalid_type_error: GatewayMessage._name.invalidType,
      required_error: GatewayMessage._name.required,
    })
    .trim(),
  URL: z
    .string({
      invalid_type_error: GatewayMessage.url.invalidType,
      required_error: GatewayMessage.url.required,
    })
    .trim(),
});

export type BaseGateway = z.infer<typeof BaseGatewaySchema>;

export const GatewayIdSchema = z.number().positive();

export type GatewayId = z.infer<typeof GatewayIdSchema>;

export const GatewayListSchema = BaseGatewaySchema.extend({
  gatewayId: z.number(),
  companyId: z.number(),
  normalizedName: z.string(),
  companyName: z.string(),
  companyNormalizedName: z.string(),
}).merge(BaseListSchema);

export type GatewayList = z.infer<typeof GatewayListSchema>;
