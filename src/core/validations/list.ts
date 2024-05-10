import { TValidationMethods } from '@/types/schemaTypes';

export const includes = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!value || !Array.isArray(validations.includes)) return false;
  return !validations.includes.some(
    (code) => code === value || JSON.stringify(code) === value
  );
};
