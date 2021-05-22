import { Request, Response, Router } from 'express';
import { GetRecordsByUserId } from './service/GetRecordsByUserId';
import { StatusCode } from '../infra/StatusCode';
import { ResponseResult } from '../infra/ResponseResult';
import { UserNotExistError } from '../user/error/UserNotExistError';
import { InternalServerError } from '../infra/InternalServerError';
import { GetPracticalCourse } from './service/GetPracticalCourse';

class DrivingRecordController {
  getRouter():Router {
    const router = Router();
    router.get('/api/v1/records/practical', this.getPracticalCourse);
    router.get('/api/v1/records/:userId', this.getRecordByUserId);
    return router;
  }

  async getPracticalCourse(req:Request, res:Response) {
    const service = new GetPracticalCourse();
    try {
      const result = await service.execute();
      res.status(StatusCode.OK).json({
        result: ResponseResult.Success,
        data: result,
      });
    } catch (e) {
      console.log(e);
      res.status(StatusCode.ServerError).json({
        result: ResponseResult.Fail,
        message: new InternalServerError().message,
      });
    }
  }

  async getRecordByUserId(req:Request, res:Response) {
    const { userId } = req.params;
    const service = new GetRecordsByUserId();
    try {
      const result = await service.execute(Number(userId));
      res.status(StatusCode.OK).json({
        result: ResponseResult.Success,
        data: result,
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

export default new DrivingRecordController();
