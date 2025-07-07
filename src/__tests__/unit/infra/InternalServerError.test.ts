import InternalServerError from '../../../infra/InternalServerError';

describe('InternalServerError', () => {
  it('should create error with default message', () => {
    const error = new InternalServerError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InternalServerError);
    expect(error.message).toBe('InternalServerError');
    expect(error.name).toBe('InternalServerError');
  });

  it('should create error with custom message', () => {
    const customMessage = 'Database connection failed';
    const error = new InternalServerError(customMessage);

    expect(error.message).toBe(customMessage);
    expect(error.name).toBe('InternalServerError');
  });

  it('should have proper stack trace', () => {
    const error = new InternalServerError();

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('InternalServerError');
  });

  it('should be throwable', () => {
    expect(() => {
      throw new InternalServerError('Server error');
    }).toThrow(InternalServerError);
  });

  it('should be catchable as Error', () => {
    try {
      throw new InternalServerError();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(InternalServerError);
    }
  });
});