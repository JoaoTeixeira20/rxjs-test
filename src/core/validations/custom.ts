import { TValidations } from '@/interfaces/schema';

export const callback = (
  value: unknown,
  validations: TValidations
): boolean => {
  if (!validations.callback) return false;

  return validations.callback(value);
};
