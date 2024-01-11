import { z } from "zod";

export const AuthDetailsSchema = z.object({
  userId: z.number(),
  companyId: z.number(),
});

export type AuthDetails = z.infer<typeof AuthDetailsSchema>;

export const BaseListSchema = z.object({
  isDeleted: z.literal(0).or(z.literal(1).or(z.boolean())),
  createdBy: z.number(),
  createdOn: z.string().datetime(),
  updatedBy: z.nullable(z.number()),
  updatedOn: z.nullable(z.string().datetime()),
});

export type BaseList = z.infer<typeof BaseListSchema>;


export const BaseDetailsSchema = z.object({
  companyId: z.number(),
  isDeleted: z.literal(0).or(z.literal(1).or(z.boolean())),
  createdBy: z.number(),
  createdOn: z.string().datetime(),
  updatedBy: z.nullable(z.number()),
  updatedOn: z.nullable(z.string().datetime()),
});

export type BaseDetails = z.infer<typeof BaseDetailsSchema>;
