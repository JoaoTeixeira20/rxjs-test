import length from '@/core/validations/length';
import document from '@/core/validations/document';
import { min, max, between, sequential } from '@/core/validations/number';
import {
  regex,
  url,
  email,
  onlyLetters,
  notAllowSpaces,
  hasNoExtraSpaces,
  repeated,
} from '@/core/validations/regex';
import { callback } from '@/core/validations/custom';
import { includes } from '@/core/validations/list';
import {
  isCreditCard,
  isCreditCardAndLength,
  isCreditCodeMatch,
} from '@/core/validations/creditCard';
import { TValidationMethods } from '@/types/schemaTypes';

export const validations: Record<
  keyof TValidationMethods,
  (value: unknown, validations: TValidationMethods) => boolean
> = {
  max,
  min,
  length,
  regex,
  url,
  email,
  onlyLetters,
  notAllowSpaces,
  callback,
  hasNoExtraSpaces,
  between,
  sequential,
  includes,
  repeated,
  document,
  isCreditCard,
  isCreditCodeMatch,
  isCreditCardAndLength,
  required: (value, validations) =>
    !!(
      validations.required &&
      (!value || (typeof value === 'string' && value.length === 0))
    ),
  value: (value, validations) =>
    !!(validations.value && value !== validations.value),
  notEmpty: (value, validations) =>
    !!(validations.notEmpty && !(value as string).trim().length),
  greaterThan: () => true,
  isNumber: () => true,
};
