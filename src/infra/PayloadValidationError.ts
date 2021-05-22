import CustomError from './CustomError';

export class PayloadValidationError extends CustomError {
  constructor() {
    super('Payload Validation Error. Please check the payload that data required has been sent.');
  }
}
