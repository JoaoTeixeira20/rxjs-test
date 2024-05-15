import { TMasks } from '@/types/schemaTypes';

export default (value: string, masks: TMasks) => {
  if (!masks.generic) return value;

  let masked = value;
  masks.generic.forEach((item) => {
    const { to = masked.length, mask } = item;
    let { from } = item;

    if (to > value.length - 1) return;
    if (from === 0) {
      from = 1;
    }

    const maskedPortion = new Array(to - from + 2).join(mask);
    masked = masked.slice(0, from - 1) + maskedPortion + masked.slice(to);
  });
  return masked;
};
