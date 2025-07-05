import { Router } from 'express';

export abstract class BaseController {
  protected router: Router;

  public constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  protected abstract initializeRoutes(): void;
}