import { TFormatters } from "@/types/schemaTypes";

export const capitalize = (value: unknown) =>
  String(value).charAt(0).toUpperCase() + String(value).slice(1);

export const uppercase = (value: unknown) => String(value).toUpperCase();

export const onlyFloatNumber = (value: unknown, formatters: TFormatters) => {
  const { onlyFloatNumber } = formatters;

  if (!onlyFloatNumber || typeof value !== 'string' || !value) return value;

  const { precision = 2, decimal = '.' } = onlyFloatNumber;

  if (!value.includes(decimal)) {
    return value;
  }

  let replacedValue = value.replace(/[^0-9]/g, "");
  const partOf = replacedValue.slice(0, replacedValue.length - precision);
  const sliceOf = replacedValue.slice(replacedValue.length - precision);

  return parseFloat(`${partOf}.${sliceOf}`).toFixed(precision);
};
