import { z } from "zod";

export class DeviceMessage {
  static _name = {
    required: "Name required",
    invalidType: "Name must be a string",
  };
  static apiKey = {
    required: "API key required",
    invalidType: "API key must be a string",
  };

  static getErrorMessage(issues: z.ZodIssue[]) {
    let errorMessage = "";
    issues.forEach((value) => (errorMessage += `${value.message}, `));
    return errorMessage.slice(0, -2);
  }

  static success = {
    read: "Device read successfully",
    created: "Device created successfully",
    updated: "Device updated successfully",
    deleted: "Device deleted successfully",
  };

  static failure = {
    invalidId: "Invalid device id",
    duplicateName: "Device name is already exits",
  };
}
