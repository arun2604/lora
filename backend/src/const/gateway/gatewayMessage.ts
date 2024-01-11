import { z } from "zod";

export class GatewayMessage {
  static _name = {
    required: "Name required",
    invalidType: "Name must be a string",
  };
  static url = {
    required: "URL required",
    invalidType: "URL must be a string",
  };

  static getErrorMessage(issues: z.ZodIssue[]) {
    let errorMessage = "";
    issues.forEach((value) => (errorMessage += `${value.message}, `));
    return errorMessage.slice(0, -2);
  }

  static success = {
    read: "Gateway read successfully",
    created: "Gateway created successfully",
    updated: "Gateway updated successfully",
    deleted: "Gateway deleted successfully",
  };

  static failure = {
    invalidId: "Invalid gateway id",
    duplicateName: "Gateway name is already exits",
  };
}
