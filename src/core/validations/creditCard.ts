import { TValidationMethods } from '@/types/schemaTypes';
import { getTypeCard } from '@/helpers/creditCard';

export const isCreditCard = (
  value: string,
  validations: TValidationMethods
): boolean => {
  if (!value) return true;

  const [type] = getTypeCard(value, validations.isCreditCard);
  return !type;
};

export const isCreditCodeMatch = (
  value: string,
  validations: TValidationMethods
): boolean => {
  if (!value || !validations.isCreditCodeMatch) return true;
  const [type] = getTypeCard(
    validations.isCreditCodeMatch.numberCard,
    validations.isCreditCodeMatch.availableOptions
  );
  return type?.code?.size !== value.length;
};

export const isCreditCardAndLength = (
  value: string,
  validations: TValidationMethods
): boolean => {
  if (!value) return true;

  const [type, rawValue] = getTypeCard(
    value,
    validations.isCreditCardAndLength
  );
  return type && !type.lengths.includes(rawValue.length);
};
