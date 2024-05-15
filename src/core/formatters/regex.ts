import { TFormatters } from '@/types/schemaTypes';

export const onlyNumbers = (value: unknown) =>
  String(value).replace(/(\D)+/gim, '');

export const onlyLetters = (value: unknown) =>
  String(value).replace(/([0-9:\s/-])+/g, '');

export const regex = (value: unknown, formatters: TFormatters) => {
  if (!formatters.regex) return value;

  return String(value).replace(new RegExp(formatters.regex, 'g'), '');
};
