import { TValidations } from '@/interfaces/schema';

export const includes = (
  value: unknown,
  validations: TValidations
): boolean => {
  if (!value || !Array.isArray(validations.includes)) return false;
  return !validations.includes.some(
    (code) => code === value || JSON.stringify(code) === value
  );
};
