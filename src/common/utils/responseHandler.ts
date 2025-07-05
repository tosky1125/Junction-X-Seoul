import { Response } from 'express';

export interface ISuccessResponse<T = any> {
  status: 'success';
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
}

export class ResponseHandler {
  public static success<T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    meta?: ISuccessResponse['meta'],
  ): Response {
    const response: ISuccessResponse<T> = {
      status: 'success',
      data,
      timestamp: new Date().toISOString(),
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  public static created<T>(res: Response, data: T): Response {
    return this.success(res, data, 201);
  }

  public static noContent(res: Response): Response {
    return res.status(204).send();
  }

  public static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
  ): Response {
    const totalPages = Math.ceil(total / limit);
    return this.success(res, data, 200, {
      page,
      limit,
      total,
      totalPages,
    });
  }
}