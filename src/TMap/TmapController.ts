import { Request, Response, Router } from 'express';
import { Tmap } from './Tmap';
import { StatusCode } from '../infra/StatusCode';
import { ResponseResult } from '../infra/ResponseResult';
import { PayloadValidationError } from '../infra/PayloadValidationError';
import { InternalServerError } from '../infra/InternalServerError';

class TmapController {
  getRouter():Router {
    const router = Router();
    router.post('/api/v1/gasStations/', this.searchGasStation);
    return router;
  }

  async searchGasStation(req:Request, res:Response) {
    const { longitude, latitude } = req.body;

    try {
      const service = new Tmap(longitude, latitude);
      const data = await service.search();
      res.status(StatusCode.OK).json({
        result: ResponseResult.Success,
        data,
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
}

export default new TmapController();
