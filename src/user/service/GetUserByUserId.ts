import { UserRepository } from '../UserRepository';
import { UserNotExistError } from '../error/UserNotExistError';
import { User } from '../domain/User';

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

    return user;
  }
}
