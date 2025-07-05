import { Request, Response } from 'express';
import { BaseController } from '../common/base/BaseController';
import { asyncHandler, validate } from '../common/middleware';
import { ResponseHandler } from '../common/utils/responseHandler';
import { AppError } from '../common/errors/AppError';
import { GetRecordsByUserId } from './service/GetRecordsByUserId';
import { GetPracticalCourse } from './service/GetPracticalCourse';
import { InsertDrivingRecord } from './service/InsertDrivingRecord';
import { UserNotExistError } from '../user/error/UserNotExistError';
import { PayloadValidationError } from '../infra/PayloadValidationError';

class DrivingRecordController extends BaseController {
  protected initializeRoutes(): void {
    // POST /api/driving-records
    this.router.post(
      '/',
      validate([
        {
          field: 'userId',
          required: true,
          type: 'number',
          message: 'User ID is required and must be a number',
        },
        {
          field: 'courseId',
          required: true,
          type: 'number',
          message: 'Course ID is required and must be a number',
        },
        {
          field: 'startTime',
          required: true,
          type: 'string',
          message: 'Start time is required',
        },
        {
          field: 'endTime',
          required: true,
          type: 'string',
          message: 'End time is required',
        },
      ]),
      asyncHandler(this.insertRecord.bind(this)),
    );

    // GET /api/driving-records/practical-courses
    this.router.get(
      '/practical-courses',
      asyncHandler(this.getPracticalCourse.bind(this)),
    );

    // GET /api/driving-records/user/:userId
    this.router.get(
      '/user/:userId',
      validate([
        {
          field: 'userId',
          required: true,
          custom: (value) => !isNaN(Number(value)) && Number(value) > 0,
          message: 'User ID must be a positive number',
        },
      ], 'params'),
      asyncHandler(this.getRecordsByUserId.bind(this)),
    );
  }

  private async insertRecord(req: Request, res: Response): Promise<Response> {
    const service = new InsertDrivingRecord();

    try {
      const result = await service.execute(req.body);
      return ResponseHandler.created(res, result);
    } catch (error) {
      if (error instanceof PayloadValidationError) {
        throw AppError.validationError(error.message);
      }
      throw error;
    }
  }

  private async getPracticalCourse(_req: Request, res: Response): Promise<Response> {
    const service = new GetPracticalCourse();
    const result = await service.execute();
    return ResponseHandler.success(res, result);
  }

  private async getRecordsByUserId(req: Request, res: Response): Promise<Response> {
    const userId = Number(req.params['userId']);
    const service = new GetRecordsByUserId();

    try {
      const result = await service.execute(userId);
      return ResponseHandler.success(res, result);
    } catch (error) {
      if (error instanceof UserNotExistError) {
        throw AppError.notFound(error.message);
      }
      throw error;
    }
  }
}

export default new DrivingRecordController();