import { Request, Response } from 'express';
import { BaseController } from '../common/base/BaseController';
import { asyncHandler, validate } from '../common/middleware';
import { ResponseHandler } from '../common/utils/responseHandler';
import { AppError } from '../common/errors/AppError';
import { GetCarsByUserId } from './service/GetCarsByUserId';
import { UserNotExistError } from '../user/error/UserNotExistError';

class CarController extends BaseController {
  protected initializeRoutes(): void {
    // GET /api/cars/user/:userId
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
      asyncHandler(this.getCarsByUserId.bind(this)),
    );

    // TODO: Add more routes
    // POST /api/cars - Add new car
    // PUT /api/cars/:carId - Update car
    // DELETE /api/cars/:carId - Delete car
    // GET /api/cars/:carId - Get car details
    // PUT /api/cars/:carId/maintenance - Update maintenance interval
  }

  private async getCarsByUserId(req: Request, res: Response): Promise<Response> {
    const userId = Number(req.params['userId']);
    const service = new GetCarsByUserId();

    try {
      const cars = await service.execute(userId);
      return ResponseHandler.success(res, cars);
    } catch (error) {
      if (error instanceof UserNotExistError) {
        throw AppError.notFound(error.message);
      }
      throw error;
    }
  }
}

export default new CarController();