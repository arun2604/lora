import { z } from "zod";

export class LoginMessage {
  static email = {
    required: "Email required",
    invalidType: "Email must be a string",
    invalid: "Invalid email",
  };
  static password = {
    required: "Password required",
    invalidType: "Password must be a string",
    digits: "Password should contain only digits",
  };

  static getErrorMessage(issues: z.ZodIssue[]) {
    let errorMessage = "";
    issues.forEach((value) => (errorMessage += `${value.message}, `));
    return errorMessage.slice(0, -2);
  }

  static success = {
    validUser: "Login successfully",
  };

  static failure = {
    invalidEmail: "Invalid email",
    invalidPassword: "Invalid password",
  };
}
