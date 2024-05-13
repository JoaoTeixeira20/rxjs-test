import { TMasks } from '@/types/schemaTypes';

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

  const replacedValue = value.replace(/[^0-9]/g, '');

  return new Intl.NumberFormat(masks.currency.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: 'currency',
    currency: masks.currency.currency,
  }).format(+replacedValue);
};
