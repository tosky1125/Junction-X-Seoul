import { UserNotExistError } from '../../../../user/error/UserNotExistError';

describe('UserNotExistError', () => {
  it('should create error with default message', () => {
    const error = new UserNotExistError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(UserNotExistError);
    expect(error.message).toBe('User Not Existed');
    expect(error.name).toBe('UserNotExistError');
  });

  it('should always use default message', () => {
    // UserNotExistError doesn't accept custom messages
    const error = new UserNotExistError();

    expect(error.message).toBe('User Not Existed');
    expect(error.name).toBe('UserNotExistError');
  });

  it('should have proper stack trace', () => {
    const error = new UserNotExistError();

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('UserNotExistError');
  });

  it('should be throwable', () => {
    expect(() => {
      throw new UserNotExistError();
    }).toThrow(UserNotExistError);
  });

  it('should be catchable as Error', () => {
    try {
      throw new UserNotExistError();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(UserNotExistError);
    }
  });
});