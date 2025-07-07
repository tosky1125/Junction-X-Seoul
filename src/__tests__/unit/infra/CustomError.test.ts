import CustomError from '../../../infra/CustomError';

describe('CustomError', () => {
  it('should create error with default message', () => {
    const error = new CustomError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe('');
    expect(error.name).toBe('CustomError');
  });

  it('should create error with custom message', () => {
    const customMessage = 'Something went wrong';
    const error = new CustomError(customMessage);

    expect(error.message).toBe(customMessage);
    expect(error.name).toBe('CustomError');
  });

  it('should have proper stack trace', () => {
    const error = new CustomError();

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('CustomError');
  });

  it('should be throwable', () => {
    expect(() => {
      throw new CustomError('Custom error occurred');
    }).toThrow(CustomError);
  });

  it('should be catchable as Error', () => {
    try {
      throw new CustomError();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(CustomError);
    }
  });
});