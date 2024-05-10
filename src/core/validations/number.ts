import { TValidationMethods } from '@/types/schemaTypes';

export const max = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  return Number(value) > Number(validations.max);
};
export const min = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  return Number(value) < Number(validations.min);
};

export const between = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.between) return false;

  const replacedValue = String(value).replace(/[^0-9]/g, '');
  return (
    !replacedValue ||
    !Number.isInteger(parseInt(replacedValue.toString())) ||
    +replacedValue > validations.between.end ||
    +replacedValue < validations.between.start
  );
};

export const sequential = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.sequential) return false;

  const numbers = '0123456789';
  const numbersRev = '9876543210';
  const replacedValue = String(value).replace(/[^0-9]/g, '');
  return !(
    numbers.indexOf(replacedValue) === -1 &&
    numbersRev.indexOf(replacedValue) === -1
  );
};
