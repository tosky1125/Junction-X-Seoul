import { PayloadValidationError } from '../../../infra/PayloadValidationError';

describe('PayloadValidationError', () => {
  it('should create error with default message', () => {
    const error = new PayloadValidationError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(PayloadValidationError);
    expect(error.message).toBe('Payload Validation Error. Please check the payload that data required has been sent.');
    expect(error.name).toBe('PayloadValidationError');
  });

  it('should always use default message', () => {
    // PayloadValidationError doesn't accept custom messages
    const error = new PayloadValidationError();

    expect(error.message).toBe('Payload Validation Error. Please check the payload that data required has been sent.');
    expect(error.name).toBe('PayloadValidationError');
  });

  it('should have proper stack trace', () => {
    const error = new PayloadValidationError();

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('PayloadValidationError');
  });

  it('should be throwable', () => {
    expect(() => {
      throw new PayloadValidationError('Validation failed');
    }).toThrow(PayloadValidationError);
  });

  it('should be catchable as Error', () => {
    try {
      throw new PayloadValidationError();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(PayloadValidationError);
    }
  });

});