import { Request, Response, Router } from 'express';
import { GetRecordsByUserId } from './service/GetRecordsByUserId';
import { StatusCode } from '../infra/StatusCode';
import { ResponseResult } from '../infra/ResponseResult';
import { UserNotExistError } from '../user/error/UserNotExistError';
import { InternalServerError } from '../infra/InternalServerError';
import { GetPracticalCourse } from './service/GetPracticalCourse';
import { InsertDrivingRecord } from './service/InsertDrivingRecord';
import { PayloadValidationError } from '../infra/PayloadValidationError';

class DrivingRecordController {
  getRouter():Router {
    const router = Router();
    router.post('/api/v1/records', this.insertRecord);
    router.get('/api/v1/records/practical', this.getPracticalCourse);
    router.get('/api/v1/records/:userId', this.getRecordByUserId);
    return router;
  }

  async insertRecord(req:Request, res:Response) {
    const service = new InsertDrivingRecord();
    try {
      await service.execute(req.body);
      res.status(StatusCode.OK).json({
        result: ResponseResult.Success,
      });
    } catch (e) {
      if (e instanceof PayloadValidationError) {
        res.status(StatusCode.BadRequest).json({
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
