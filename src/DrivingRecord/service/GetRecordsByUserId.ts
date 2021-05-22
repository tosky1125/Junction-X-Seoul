import { UserRepository } from '../../user/UserRepository';
import { DrivingRecordRepository } from '../DrivingRecordRepository';

export class GetRecordsByUserId {
  private repo: DrivingRecordRepository;

  constructor() {
    this.repo = new DrivingRecordRepository();
  }

  async execute(userId: number) {
    const list = await this.repo.getListByUserId(userId);
    return list;
  }
}
