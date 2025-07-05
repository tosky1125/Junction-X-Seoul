import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export interface IValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message?: string;
}

export const validate = (rules: IValidationRule[], location: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const data = req[location];
    const errors: string[] = [];

    for (const rule of rules) {
      const value = data[rule.field];

      // Check required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(rule.message ?? `${rule.field} is required`);
        continue;
      }

      // Skip validation if not required and no value
      if (!rule.required && (value === undefined || value === null)) {
        continue;
      }

      // Type validation
      if (rule.type && typeof value !== rule.type) {
        errors.push(rule.message ?? `${rule.field} must be of type ${rule.type}`);
        continue;
      }

      // String length validation
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.min !== undefined && value.length < rule.min) {
          errors.push(rule.message ?? `${rule.field} must be at least ${rule.min} characters long`);
        }
        if (rule.max !== undefined && value.length > rule.max) {
          errors.push(rule.message ?? `${rule.field} must be at most ${rule.max} characters long`);
        }
      }

      // Number range validation
      if (rule.type === 'number' && typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors.push(rule.message ?? `${rule.field} must be at least ${rule.min}`);
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push(rule.message ?? `${rule.field} must be at most ${rule.max}`);
        }
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push(rule.message ?? `${rule.field} has invalid format`);
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push(rule.message ?? `${rule.field} is invalid`);
      }
    }

    if (errors.length > 0) {
      throw AppError.validationError('Validation failed', { errors });
    }

    next();
  };
};