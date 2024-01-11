import { Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { IBaseController } from "./baseController";
import { AppLogger } from "../logger";
import { IGroupService } from "../context/group/groupService";


export class GroupController extends IBaseController {
    logger: Logger = AppLogger.getInstance().getLogger(__filename);
    groupService: IGroupService = Container.get(IGroupService.identity);

    constructor() {
        super(true, "groups");
        this.router
            .route(this.path)
            .get((req, res) => this.getGroups(req, res))
            .post((req, res) => this.createGroup(req, res))
        this.router
            .route(this.path + '/:id')
            .get((req, res) => this.getgroupById(req, res))
            .put((req, res) => this.updateGroup(req, res))
            .delete((req, res) => this.deleteGroup(req, res))
        this.router
            .route(this.path + '/group-details/:id')
            .get((req, res) => this.getGroupDetails(req, res))
            .put((req, res) => this.updateGroupAndMembers(req, res))
    }
    async getGroups(req: Request, res: Response): Promise<void> {
        try {
            this.logger.info(`Working on getGroups controller`);
            const result = await this.groupService.getGroups();
            this.logger.info(`Response from getGroups controller  : ${JSON.stringify(result)}`);
            res.status(result.resultCode).json(result);
        }
        catch (error) {
            this.logger.error(error);
        }
    }

    async getGroupDetails(req: Request, res: Response) {
        try {
            this.logger.info(`working on getGroupDetails controller with id: ${req.params.id}`)
            const result = await this.groupService.getGroupDetails(Number(req.params.id));
            this.logger.info(`Response from getGroupDetails controller : ${JSON.stringify(result)}`);
            res.status(result.resultCode).json(result);
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async getgroupById(req: Request, res: Response) {
        try {
            this.logger.info(`working on getgroupById controller with id: ${req.params.id}`)
            const result = await this.groupService.getGroupById(Number(req.params.id));
            this.logger.info(`Response from getgroupById controller : ${JSON.stringify(result)}`);
            res.status(result.resultCode).json(result);
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            this.logger.info(`working on createGroup controller with : ` + JSON.stringify(req.body))
            const result: any = await this.groupService.createGroups(req.body, res.locals);
            this.logger.info(`Response from createGroup controller : ${JSON.stringify(result)}`);
            res.status(result.resultCode).json(result);
        }
        catch (error) {
            this.logger.error(error);
        }
    }

    async updateGroup(req: Request, res: Response): Promise<void> {
        try {
            this.logger.info(`working on updateGroup controller with : ${JSON.stringify(req.body)} and Id ${req.params.id}`)
            const result = await this.groupService.updateGroup(req.params.id, req.body, res.locals);
            this.logger.info(`Response from updateGroup controller : ${JSON.stringify(result)}`);
            res.status(result.resultCode).json(result);
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async updateGroupAndMembers(req: Request, res: Response): Promise<void> {
        try {
            this.logger.info(`Working on updateGroupAndMembers controller with id ${req.params.id} and details  : ${JSON.stringify(req.body)}`);
            let result = await this.groupService.updateGroupAndMembers(req.params.id, req.body, res.locals)
            this.logger.info(`Response from updateGroupAndMembers controller : ${JSON.stringify(result)}`);
            res.status(result.resultCode).json(result);
        }
        catch (error) {
            this.logger.error(error)
        }
    }

    async deleteGroup(req: Request, res: Response) {
        try {
            this.logger.info(`Working on deleteGroup controller with id ${req.params.id}`);
            let result = await this.groupService.deleteGroup(Number(req.params.id), res.locals)
            this.logger.info(`Response from deleteGroup controller : ${JSON.stringify(result)}`);
            res.status(result.resultCode).json(result);
        }
        catch (error) {
            this.logger.info(error)
        }
    }
}
