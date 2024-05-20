import { TMasks } from '@/types/schemaTypes';
import generic from '@/core/masks/generic';
import { currency, custom, replaceAll } from '@/core/masks/string';
import {
  secureCreditCard,
  card,
  cardDate,
  fein,
} from '@/core/masks/creditCard';

export const masks: Record<
  keyof TMasks,
  (value: unknown, masks?: TMasks) => unknown
> = {
  currency,
  custom,
  callback: (value: unknown, masks?: TMasks): unknown =>
    masks?.callback && masks.callback(value),
  generic,
  secureCreditCard,
  card,
  cardDate,
  fein,
  replaceAll,
};
