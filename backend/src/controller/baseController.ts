import express, { Router } from "express";

export abstract class IBaseController {
  router: Router;
  path: string;
  isProtected: boolean;

  constructor(pIsProtected = true, path: string) {
    this.isProtected = pIsProtected;
    this.router = express.Router();
    this.path = this.isProtected ? `/auth/${path}` : `/${path}`;
  }
}
