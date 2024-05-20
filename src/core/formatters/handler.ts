import { TFormatters } from '@/types/schemaTypes';
import { splitter, undo_splitter } from '@/core/formatters/splitter';
import {
  capitalize,
  uppercase,
  onlyFloatNumber,
} from '@/core/formatters/string';
import { onlyNumbers, onlyLetters, regex } from '@/core/formatters/regex';
import { formatValue, getTypeCard } from '@/helpers/creditCard';
export const formatters: Record<
  keyof TFormatters,
  (value: unknown, formatters?: TFormatters) => unknown
> = {
  capitalize,
  uppercase,
  onlyNumbers,
  onlyLetters,
  regex,
  splitter,
  undo_splitter,
  onlyFloatNumber,
  dotEvery3chars: (value: unknown) => {
    const result = String(value)
      .replace(/\./g, '')
      .replace(/(.{3})/g, '$1.');
    return result.endsWith('.') ? result.slice(0, -1) : result;
  },
  gapsCreditCard: (value: unknown, formatters) => {
    const [type, rawValue] = getTypeCard(
      <string>value,
      formatters?.gapsCreditCard
    );
    return formatValue(rawValue, type);
  },
  callback: (value: unknown, formatters) =>
    formatters?.callback && formatters.callback(value),
};
