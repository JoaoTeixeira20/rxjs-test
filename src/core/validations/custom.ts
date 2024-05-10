import { TValidationMethods } from '@/types/schemaTypes';

export const callback = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.callback) return false;

  return validations.callback(value);
};
