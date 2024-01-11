import { z } from "zod";

export class UserRoleMessage {
  static _name = {
    required: "Name required",
    invalidType: "Name must be a string",
    invalid: "Name should contain only alphabet or space",
  };

  static getErrorMessage(issues: z.ZodIssue[]) {
    let errorMessage = "";
    issues.forEach((value) => (errorMessage += `${value.message}, `));
    return errorMessage.slice(0, -2);
  }

  static success = {
    read: "User role read successfully",
    created: "User role created successfully",
    updated: "User role updated successfully",
    deleted: "User role deleted successfully",
  };

  static failure = {
    invalidId: "Invalid user role id",
    duplicateName: "User role name is already exits",
  };
}
