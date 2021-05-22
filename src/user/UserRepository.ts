import { QueryExecutor } from '../infra/QueryExecutor';
import { UserMapper } from './UserMapper';
import { User } from './domain/User';

export class UserRepository {
  async getUserDetailByUserId(userId: number): Promise<User | null> {
    const conn = QueryExecutor.getInstance().getConnection();
    const [user] = await conn('users').select().where({ user_id: userId });
    const cars = await conn('cars').select().where({ user_id: userId });
    const drivingRecords = await conn('driving_records').select().where({ user_id: userId });
    const recordIds = drivingRecords.map((e:any) => e.record_id);
    const characters = await conn('course_character').select().whereIn('record_id', recordIds);
    return UserMapper.toService(user, cars, drivingRecords, characters);
  }
}
