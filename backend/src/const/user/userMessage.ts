import { z } from "zod";

export class UserMessage {
  static userRoleId = {
    required: "User role id required",
    invalidType: "User role id must be a number",
    invalid: "User role id must be positive number",
  };
  static _name = {
    required: "Name required",
    invalidType: "Name must be a string",
    minimumCharacter: "Name must contain at least 3 character",
    invalid: "Name should contain only alphabet or space",
  };
  static email = {
    required: "Email required",
    invalidType: "Email must be a string",
    invalid: "Invalid email",
  };
  static password = {
    required: "Password required",
    invalidType: "Password must be a string",
    minimumCharacter: "Password must contain at least 8 character",
    digits: "Password should contain only digits",
  };
  static mobileNumber = {
    required: "Mobile number required",
    invalidType: "Mobile number must be a string",
    invalid: "Mobile number should have 10 digits",
    digits: "Mobile number should contain only digits",
  };

  static getErrorMessage(issues: z.ZodIssue[]) {
    let errorMessage = "";
    issues.forEach((value) => (errorMessage += `${value.message}, `));
    return errorMessage.slice(0, -2);
  }

  static success = {
    read: "User read successfully",
    created: "User created successfully",
    updated: "User updated successfully",
    deleted: "User deleted successfully",
  };

  static failure = {
    invalidId: "Invalid User id",
    duplicateEmail: "Email is already exits",
  };
}
