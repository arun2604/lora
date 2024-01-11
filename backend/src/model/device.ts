import { z } from "zod";
import { BaseListSchema } from "./baseModel";
import { DeviceMessage } from "../const/device/deviceMessage";

export const BaseDeviceSchema = z.object({
  name: z
    .string({
      invalid_type_error: DeviceMessage._name.invalidType,
      required_error: DeviceMessage._name.required,
    })
    .trim(),
  APIKey: z
    .string({
      invalid_type_error: DeviceMessage.apiKey.invalidType,
      required_error: DeviceMessage.apiKey.required,
    })
    .trim(),
});

export type BaseDevice = z.infer<typeof BaseDeviceSchema>;

export const DeviceIdSchema = z.number().positive();

export type DeviceId = z.infer<typeof DeviceIdSchema>;

export const DeviceListSchema = BaseDeviceSchema.extend({
  deviceId: z.number(),
  companyId: z.number(),
  normalizedName: z.string(),
  companyName: z.string(),
  companyNormalizedName: z.string(),
}).merge(BaseListSchema);

export type DeviceList = z.infer<typeof DeviceListSchema>;
