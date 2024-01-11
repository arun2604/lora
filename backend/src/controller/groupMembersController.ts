import { Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { IBaseController } from "./baseController";
import { AppLogger } from "../logger";
import { IGroupMemberService } from "../context/groupMembers/groupMemberService";


export class GroupMemberController extends IBaseController {
    logger: Logger = AppLogger.getInstance().getLogger(__filename);
    groupMembersService: IGroupMemberService = Container.get(IGroupMemberService.identity);

    constructor() {
        super(true, "group-members");
        this.router
            .route(this.path)
            .get((req, res) => this.getAllGroupMembers(req, res))
            .post((req, res) => this.createGroupMember(req, res))
        this.router
            .route(this.path + '/:id')
            .get((req, res) => this.getgroupMemberById(req, res))
            .put((req, res) => this.updateGroupmember(req, res))
            .delete((req, res) => this.deleteGroupmember(req, res))
        this.router
            .route(this.path + '/group/:id')
            .get((req, res) => this.getgroupMemberNotInGroup(req, res))
        this.router
            .route(this.path + '/multiple')
            .post((req, res) => this.createMultipleGroupMember(req, res))
    }

    async getAllGroupMembers(req: Request, res: Response) {
        try {
            this.logger.info(`Working on getGroups controller`);
            const result = await this.groupMembersService.getGroupMembers();
            this.logger.info(`Response from getAllGroupMembers controller  : ${JSON.stringify(result)}`);
            res.status(result.resultCode).json(result);
        }
        catch (error) {
            this.logger.error(error)
        }
    }
    async getgroupMemberById(req: Request, res: Response) {
        try {
            this.logger.info(`working on getgroupMemberById controller with id: ${req.params.id}`)
            const result = await this.groupMembersService.getGroupMemberById(Number(req.params.id));
            this.logger.info(`Response from getgroupMemberById controller : ${JSON.stringify(result)}`);
            res.status(result.resultCode).json(result);
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async getgroupMemberNotInGroup(req: Request, res: Response) {
        try {
            this.logger.info(`working on getgroupMemberNotInGroup controller with id: ${req.params.id}`)
            const result = await this.groupMembersService.getGroupMemberNotInGroup(Number(req.params.id));
            this.logger.info(`Response from getgroupMemberNotInGroup controller : ${JSON.stringify(result)}`);
            res.status(result.resultCode).json(result);
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async createGroupMember(req: Request, res: Response) {
        try {
            this.logger.info(`working on createGroupMember controller with details ${JSON.stringify(req.body)}`)
            let groupMember = await this.groupMembersService.createGroupMember(req.body, res.locals);
            this.logger.info(`Response from createGroupMember controller : ${JSON.stringify(groupMember)}`);
            res.status(groupMember.resultCode).json(groupMember);
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async createMultipleGroupMember(req: Request, res: Response) {
        try {
            this.logger.info(`working on createMultipleGroupMember controller with details ${JSON.stringify(req.body)}`)
            let groupMember = await this.groupMembersService.createMulltipleGroupMember(req.body, res.locals);
            this.logger.info(`Response from createMultipleGroupMember controller : ${JSON.stringify(groupMember)}`);
            res.status(groupMember.resultCode).json(groupMember);
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async updateGroupmember(req: Request, res: Response) {
        try {
            this.logger.info(`working on updateGroupmember controller with details ${JSON.stringify(req.body)}`)
            let groupMember = await this.groupMembersService.updateGroupMember(Number(req.params.id), req.body, res.locals);
            this.logger.info(`Response from createGroupMember controller : ${JSON.stringify(groupMember)}`);
            res.status(groupMember.resultCode).json(groupMember);
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async deleteGroupmember(req: Request, res: Response) {
        try {
            this.logger.info(`working on deleteGroupmember with group member id : ${req.params.is}`)
            let deleteMember = await this.groupMembersService.deleteGroupMember(Number(req.params.id), res.locals);
            this.logger.info(`Response from deleteGroupmember controller : ${JSON.stringify(deleteMember)}`);
            res.status(deleteMember.resultCode).json(deleteMember);
        }
        catch (error) {
            this.logger.error(error)
        }
    }
}