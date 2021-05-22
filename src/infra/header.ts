import { Request, Response } from 'express';

const map = {
  'Access-control-Allow-Origin': '*',
  'Access-control-Allow-Headers': 'Cache-Control, Pragma, Authorization, Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept, x-api-key',
  'Access-control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-control-Allow-Credentials': true,
  'Cache-Control': 'no-cache, must-revalidate',
  vary: 'Origin',
};

const setheader = (response: Response,
                   header: any,
                   value: any) => response.setHeader(header, value);

export default function () {
  return (request : Request, response: Response, next : any) => {
    Object.keys(map).forEach((key, index) => {
      if (index) {
        setheader(response, key, map[key]);
      } else {
        setheader(response, key, request.get('Origin') ? request.get('Origin') : '*');
      }
    });
    next();
  };
}
