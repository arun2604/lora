import { z } from "zod";


export class GroupMembersMessages {
    static groupId = {
        required: "Group id required",
        invalidType: "Group id must be a number",
        invalid: "Group id must be positive number",
    };
    static deviceId = {
        required: "Device id required",
        invalidType: "Device id must be a number",
        invalid: "Device id must be positive number",
    };

    static getErrorMessage(issues: z.ZodIssue[]) {
        let errorMessage = "";
        issues.forEach((value) => (errorMessage += `${value.message}, `));
        return errorMessage.slice(0, -2);
    }

    static success = {
        read: "Group members read successfully",
        created: "Group member created successfully",
        updated: "Group member updated successfully",
        deleted: "Group member deleted successfully",
    };

    static failure = {
        invalidId: "Invalid Group member id",
        duplicate: "Group member already exits",
        minimumRequired: "Group must atleast have one member"
    };
}