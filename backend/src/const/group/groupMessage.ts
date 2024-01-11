import { z } from "zod";


export class GroupMessages {
    static groupName = {
        required: "Group name required",
        invalidType: "Group name must be a string",
        minimumCharacter: "Group name must contain at least 3 character",
    }
    static groupId = {
        required: "Group id required",
        invalidType: "Group id must be a number",
        invalid: "Group id must be positive number",
    };

    static getErrorMessage(issues: z.ZodIssue[]) {
        let errorMessage = "";
        issues.forEach((value) => (errorMessage += `${value.message}, `));
        return errorMessage.slice(0, -2);
    }

    static success = {
        read: "Group read successfully",
        created: "Group created successfully",
        updated: "Group updated successfully",
        deleted: "Group deleted successfully",
    };

    static failure = {
        invalidId: "Invalid Group id",
        duplicateName: "Group name is already exits",
    };
}