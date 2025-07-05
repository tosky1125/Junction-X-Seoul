import { Request, Response } from 'express';
import { BaseController } from '../common/base/BaseController';
import { asyncHandler } from '../common/middleware';
import { validate } from '../common/middleware';
import { ResponseHandler } from '../common/utils/responseHandler';
import { AppError } from '../common/errors/AppError';
import { GetUserByUserId } from './service/GetUserByUserId';
import { UserNotExistError } from './error/UserNotExistError';

class UserController extends BaseController {
  protected initializeRoutes(): void {
    // GET /api/users/:userId
    this.router.get(
      '/:userId',
      validate([
        {
          field: 'userId',
          required: true,
          custom: (value) => !isNaN(Number(value)) && Number(value) > 0,
          message: 'User ID must be a positive number',
        },
      ], 'params'),
      asyncHandler(this.getUserById.bind(this)),
    );

    // TODO: Add more routes
    // POST /api/users - Create user
    // PUT /api/users/:userId - Update user
    // DELETE /api/users/:userId - Delete user
    // GET /api/users - List users with pagination
  }

  private async getUserById(req: Request, res: Response): Promise<Response> {
    const userId = Number(req.params['userId']);
    const service = new GetUserByUserId();

    try {
      const user = await service.execute(userId);
      return ResponseHandler.success(res, user);
    } catch (error) {
      if (error instanceof UserNotExistError) {
        throw AppError.notFound(error.message);
      }
      throw error;
    }
  }
}

export default new UserController();