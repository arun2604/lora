import { z } from "zod";

export class PermissionMessage {
  static _name = {
    required: "Name required",
    invalidType: "Name must be a string",
    invalid: "Name should contain only alphabet or space or underscore",
  };

  static getErrorMessage(issues: z.ZodIssue[]) {
    let errorMessage = "";
    issues.forEach((value) => (errorMessage += `${value.message}, `));
    return errorMessage.slice(0, -2);
  }

  static success = {
    read: "Permission read successfully",
    created: "Permission created successfully",
    updated: "Permission updated successfully",
    deleted: "Permission deleted successfully",
  };

  static failure = {
    invalidId: "Invalid permission id",
    duplicateName: "Permission name is already exits",
  };
}
