import { QueryExecutor } from '../infra/QueryExecutor';
import { User } from './domain/User';

export class UserRepository {
  async getUserDetailByUserId(userId: number): Promise<User | null> {
    const conn = QueryExecutor.getInstance().getConnection();
    const [user] = await conn('users').select().where({ user_id: userId });
    return new User(user.user_id, user.name);
  }
}
