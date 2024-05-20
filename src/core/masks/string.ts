import { TMasks } from '@/types/schemaTypes';
import { isNumber } from 'lodash';
import { getCurrencySymbol } from '@gaignoux/currency';

export const replaceAll = (value: string, masks: TMasks): unknown => {
  let targetReplaceMask = masks.replaceAll;
  if (!targetReplaceMask) return value;

  if (typeof targetReplaceMask === 'number') {
    targetReplaceMask = targetReplaceMask?.toString();
  }
  return new Array(value.length + 1).join(targetReplaceMask);
};

export const currency = (value: string, masks: TMasks): unknown => {
  if (!masks?.currency) return value;

  const {
    align = 'right',
    decimal = '.',
    precision = 2,
    prefix = 'BBD',
    thousands = ',',
  } = masks.currency;

  const rawValue = isNumber(value) ? Number(value).toFixed(precision) : value;
  const convertedValue = rawValue.replace(/[^0-9]/g, '');

  if (!convertedValue) {
    return '';
  }

  let integerPart = convertedValue
    .slice(0, convertedValue.length - precision)
    .replace(/^0*/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, thousands);

  if (integerPart === '') {
    integerPart = '0';
  }

  let newRawValue = integerPart;
  let decimalPart = convertedValue.slice(convertedValue.length - precision);

  if (precision > 0) {
    decimalPart = '0'.repeat(precision - decimalPart.length) + decimalPart;
    newRawValue += decimal + decimalPart;
  }
  const symbol = getCurrencySymbol(prefix);

  return align === 'left'
    ? `${symbol} ${newRawValue}`
    : `${newRawValue} ${symbol}`;
};

export const custom = (value: string, masks: TMasks): string => {
  if (!masks.custom || !value) return value;

  let mask: string = '';
  let index: number = 0;

  for (let i = 0; i < masks.custom.length; i++) {
    if (masks.custom[i] === '#') {
      if (index < value.length) {
        mask += value[index];
        index++;
      } else {
        break;
      }
    } else {
      mask += masks.custom[i];
    }
  }

  return mask;
};
