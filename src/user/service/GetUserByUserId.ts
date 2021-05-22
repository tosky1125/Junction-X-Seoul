import { UserRepository } from '../UserRepository';
import { UserNotExistError } from '../error/UserNotExistError';
import { User } from '../domain/User';
import { GetRecordsByUserId } from '../../DrivingRecord/service/GetRecordsByUserId';
import { GetCarsByUserId } from '../../car/service/GetCarsByUserId';

export class GetUserByUserId {
  private repo: UserRepository;

  constructor(
  ) {
    this.repo = new UserRepository();
  }

  async execute(userId: number) : Promise<User> {
    const user = await this.repo.getUserDetailByUserId(userId);
    if (!user) {
      throw new UserNotExistError();
    }
    const record = await new GetRecordsByUserId().execute(userId);
    const cars = await new GetCarsByUserId().execute(userId);
    user.setDrivingRecords(record);
    user.setCars(cars);
    return user;
  }
}
