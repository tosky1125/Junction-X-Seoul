import { Request, Response } from 'express';
import { BaseController } from '../common/base/BaseController';
import { asyncHandler, validate } from '../common/middleware';
import { ResponseHandler } from '../common/utils/responseHandler';
import { AppError } from '../common/errors/AppError';
import { Tmap } from './Tmap';
import { PayloadValidationError } from '../infra/PayloadValidationError';

class TmapController extends BaseController {
  protected initializeRoutes(): void {
    // POST /api/tmap/search
    this.router.post(
      '/search',
      validate([
        {
          field: 'longitude',
          required: true,
          type: 'number',
          min: -180,
          max: 180,
          message: 'Longitude must be a number between -180 and 180',
        },
        {
          field: 'latitude',
          required: true,
          type: 'number',
          min: -90,
          max: 90,
          message: 'Latitude must be a number between -90 and 90',
        },
        {
          field: 'searchKeyword',
          required: true,
          type: 'string',
          min: 1,
          message: 'Search keyword is required',
        },
      ]),
      asyncHandler(this.searchDestination.bind(this)),
    );

    // POST /api/tmap/gas-stations
    this.router.post(
      '/gas-stations',
      validate([
        {
          field: 'longitude',
          required: true,
          type: 'number',
          min: -180,
          max: 180,
          message: 'Longitude must be a number between -180 and 180',
        },
        {
          field: 'latitude',
          required: true,
          type: 'number',
          min: -90,
          max: 90,
          message: 'Latitude must be a number between -90 and 90',
        },
      ]),
      asyncHandler(this.searchGasStation.bind(this)),
    );

    // POST /api/tmap/route
    this.router.post(
      '/route',
      validate([
        {
          field: 'startX',
          required: true,
          type: 'number',
          message: 'Start longitude is required',
        },
        {
          field: 'startY',
          required: true,
          type: 'number',
          message: 'Start latitude is required',
        },
        {
          field: 'endX',
          required: true,
          type: 'number',
          message: 'End longitude is required',
        },
        {
          field: 'endY',
          required: true,
          type: 'number',
          message: 'End latitude is required',
        },
      ]),
      asyncHandler(this.getRoute.bind(this)),
    );
  }

  private async searchDestination(req: Request, res: Response): Promise<Response> {
    const { longitude, latitude, searchKeyword } = req.body;

    try {
      const service = new Tmap(longitude, latitude, searchKeyword, false);
      const data = await service.search();
      return ResponseHandler.success(res, data);
    } catch (error) {
      if (error instanceof PayloadValidationError) {
        throw AppError.validationError(error.message);
      }
      throw error;
    }
  }

  private async searchGasStation(req: Request, res: Response): Promise<Response> {
    const { longitude, latitude } = req.body;

    try {
      const service = new Tmap(longitude, latitude);
      const data = await service.search();
      return ResponseHandler.success(res, data);
    } catch (error) {
      if (error instanceof PayloadValidationError) {
        throw AppError.validationError(error.message);
      }
      throw error;
    }
  }

  private async getRoute(req: Request, res: Response): Promise<Response> {
    // TODO: Implement route calculation
    const { startX, startY, endX, endY } = req.body;
    
    // Placeholder response
    return ResponseHandler.success(res, {
      distance: 0,
      duration: 0,
      route: [],
      message: 'Route calculation not implemented yet',
    });
  }
}

export default new TmapController();