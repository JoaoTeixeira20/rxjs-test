import creditCardType from 'credit-card-type';

export interface ICreditCardType {
  niceType: string;
  type: string;
  patterns: number[] | [number[]];
  gaps: number[];
  lengths: number[];
  code: {
    size: number;
    name: string;
  };
  matchStrength?: number;
}

type TGetTypeCard = [ICreditCardType, string];

export const getTypeCard = (
  value: string,
  availableOptions?: string[]
): TGetTypeCard => {
  const rawValue = removeGaps(value.toString());
  const types = creditCardType(rawValue);
  const selected = availableOptions?.length
    ? types?.filter(({ type: id1 }) =>
        availableOptions.some((id2) => id2 === id1)
      )[0]
    : types[0];

  return [selected, rawValue];
};

const removeGaps = (value: string): string => value?.replace(/ /g, '');

const addGaps = (value: string, gaps = []): string => {
  const [regexString, replaceString] = gaps.reduce(
    ([regexString, replaceString], offset, i) => {
      const lastOffset = gaps[i - 1] || 0;
      const digitNumber = offset - lastOffset;

      return [
        `${regexString}([0-9]{0,${digitNumber}})`,
        `${replaceString}$${i + 1} `,
      ];
    },
    ['', '']
  );

  return value.replace(new RegExp(regexString), replaceString).trim();
};

export const formatValue = (value: string, type: ICreditCardType): string => {
  const DEFAULT_LENGTH = 19;

  return type
    ? addGaps(value.slice(0, type?.lengths[0]), type.gaps as [])
    : value.slice(0, DEFAULT_LENGTH);
};

export const formatDateCard = (
  value: string,
  end = 4,
  prefix = '/'
): string => {
  const fixedValue = value.replace(/\D/g, '');
  const valZeroTwo = fixedValue.slice(0, 2);

  return fixedValue.length >= 5
    ? `${valZeroTwo}${prefix}${fixedValue.slice(2, end)}`
    : fixedValue.length >= 3
      ? `${valZeroTwo}${prefix}${fixedValue.slice(2)}`
      : fixedValue;
};
