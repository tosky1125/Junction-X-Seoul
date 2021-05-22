import CustomError from '../../infra/CustomError';

export class UserNotExistError extends CustomError {
  constructor() {
    super('User Not Existed');
  }
}
