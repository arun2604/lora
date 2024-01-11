import { z } from "zod";

export class CompanyMessage {
  static _name = {
    required: "Name required",
    invalidType: "Name must be a string",
    minimumCharacter: "Name must contain at least 3 character",
  };
  static email = {
    required: "Email required",
    invalidType: "Email must be a string",
    invalid: "Invalid email",
  };
  static mobileNumber = {
    required: "Mobile number required",
    invalidType: "Mobile number must be a string",
    invalid: "Mobile number should have 10 digits",
    digits: "Mobile number should contain only digits",
  };
  static landmark = {
    required: "Landmark required",
    invalidType: "Landmark must be a string",
    invalid: "Landmark should contain only alphabet or space",
  };
  static city = {
    required: "City required",
    invalidType: "City must be a string",
    invalid: "City should contain only alphabet or space",
  };
  static state = {
    required: "State required",
    invalidType: "State must be a string",
    invalid: "State should contain only alphabet or space",
  };
  static country = {
    required: "Landmark required",
    invalidType: "Landmark must be a string",
    invalid: "Country should contain only alphabet or space",
  };
  static zipCode = {
    required: "Zip code required",
    invalidType: "Zip code must be a string",
    invalid: "Zip code should have 6 digits",
    digits: "Zip code should contain only digits",
  };

  static getErrorMessage(issues: z.ZodIssue[]) {
    let errorMessage = "";
    issues.forEach((value) => (errorMessage += `${value.message}, `));
    return errorMessage.slice(0, -2);
  }

  static success = {
    read: "Company read successfully",
    created: "Company created successfully",
    updated: "Company updated successfully",
    deleted: "Company deleted successfully",
  };

  static failure = {
    invalidId: "Invalid company id",
    duplicateName: "Company name is already exits",
  };
}
