import { QueryExecutor } from '../infra/QueryExecutor';
import { CarMapper } from './CarMapper';

export class CarRepository {
  async getCarListByUserId(userId:number) {
    const conn = QueryExecutor.getInstance().getConnection();
    const cars = await conn('cars').select().where({ user_id: userId });
    return CarMapper.toService(cars);
  }
}
