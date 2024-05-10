import { TValidationMethods } from '@/types/schemaTypes';

export const regex = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.regex) return false;

  const regex = new RegExp(validations.regex);
  return !regex.test(<string>value);
};

export const email = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.email) return false;

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !regex.test(<string>value);
};

export const url = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.url) return false;

  const regex =
    /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;
  return !regex.test(<string>value);
};

export const onlyLetters = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.onlyLetters) return false;

  return !/^[a-zA-Z\s]*$/.test(<string>value);
};

export const notAllowSpaces = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.notAllowSpaces) return false;

  return /\s/.test(<string>value);
};

export const isNumber = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.isNumber) return false;

  return !!value && !/^[0-9\s]*$/.test(<string>value);
};

/**
 * Check if it has trailing/landing spaces.
 */
export const hasNoExtraSpaces = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.hasNoExtraSpaces) return false;

  return regex(value, {
    regex: '^[A-Za-z0-9.-]+(?: +[A-Za-z0-9.-]+)*$',
  });
};

export const repeated = (
  value: unknown,
  validations: TValidationMethods
): boolean => {
  if (!validations.repeated) return false;

  const replacedValue = String(value).replace(/[^0-9]/g, '');
  const regex = /\b(\d)\1+\b/gm;
  return regex.test(replacedValue);
};
