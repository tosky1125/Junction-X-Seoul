import { Request, Response, Router } from 'express';
import { GetUserByUserId } from './service/GetUserByUserId';
import { StatusCode } from '../infra/StatusCode';
import { ResponseResult } from '../infra/ResponseResult';
import { UserNotExistError } from './error/UserNotExistError';
import { InternalServerError } from '../infra/InternalServerError';

class UserController {
  getRouter():Router {
    const router = Router();
    router.get('/api/v1/users/:id', this.getUserById);
    return router;
  }

  async getUserById(req:Request, res:Response) {
    const userId = req.params.id;
    const service = new GetUserByUserId();
    try {
      const user = await service.execute(Number(userId));
      res.status(StatusCode.OK).json({
        result: ResponseResult.Success,
        data: user,
      });
    } catch (e) {
      if (e instanceof UserNotExistError) {
        res.status(StatusCode.Notfound).json({
          result: ResponseResult.Fail,
          message: e.message,
        });
      }
      console.log(e);
      res.status(StatusCode.ServerError).json({
        result: ResponseResult.Fail,
        message: new InternalServerError().message,
      });
    }
  }
}

export default new UserController();
