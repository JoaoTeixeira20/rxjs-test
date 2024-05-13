import { formatDateCard } from '@/helpers/creditCard';
import generic from '@/core/masks/generic';

export const secureCreditCard = (value: string) => {
  const maskValue = [
    {
      from: 1,
      to: 4,
      mask: 'x',
    },
    {
      from: 6,
      to: 9,
      mask: 'x',
    },
    {
      from: 11,
      to: 14,
      mask: 'x',
    },
    {
      from: 16,
      to: 19,
      mask: 'x',
    },
  ];
  return generic(value, { generic: maskValue });
};

export const card = (value: string) => {
  return value
    .replace(/[^\dA-Z]/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
};

export const cardDate = (value: string) => formatDateCard(value);

export const fein = (value: string) => formatDateCard(value, 9, '-');
