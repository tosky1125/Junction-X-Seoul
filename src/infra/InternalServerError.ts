import CustomError from './CustomError';

export class InternalServerError extends CustomError {
  constructor() {
    super('Server Error Occurred.');
  }
}
