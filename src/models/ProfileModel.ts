export interface ProfileModel {
    userId: number;
    companyId: number;
    userRoleId: number;
    name: string;
    normalizedName: string;
    email: string;
    normalizedEmail: string;
    isEmailConfirmed: boolean;
    password: string;
    mobileNumber: string;
    isMobileNumberConfirmed: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: number;
    createdOn: string;
    updatedBy: number;
    updatedOn: string;
}
