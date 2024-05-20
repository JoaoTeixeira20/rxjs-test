import { TValidationMethods } from '@/types/schemaTypes';
import { TCurrencyLocalCode } from '@gaignoux/currency';

const NIF_ES = (value: string): boolean => {
  if (value.length !== 9) return true;

  if (!/^\d{8}$/.test(value.slice(0, 8))) {
    return true;
  }

  const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const numberPart = parseInt(value.slice(0, 8), 10);
  const expectedLetter = validLetters[numberPart % 23];

  return !(value[8].toUpperCase() === expectedLetter);
};

const NIF_PT = (value: string): boolean => {
  const regex = /^\d{9}$/;
  if (!regex.test(value)) return false;

  const checkDigit = parseInt(value[8], 10);
  const sum = Array.from(value.substring(0, 8)).reduce(
    (acc, digit, index) => acc + parseInt(digit, 10) * (9 - index),
    0
  );

  const calculatedCheckDigit = 11 - (sum % 11);
  return calculatedCheckDigit === 10 || calculatedCheckDigit === 11
    ? 0 === checkDigit
    : calculatedCheckDigit === checkDigit;
};

const NIF_IT = (value: string): boolean => {
  const regex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;
  return regex.test(value);
};

const NIF_DE = (nif: string): boolean => {
  const regex = /^\d{11}$/;
  return regex.test(nif);
};

const NIF_FR = (nif: string): boolean => {
  const regex = /^\d{2} \d{3} \d{3} \d{3} \d{3}$/;
  return regex.test(nif);
};

const NIF_UK = (value: string): boolean => {
  const regex = /^GB\d{9}|\d{12}|\d{3}[A-Z]{5}$/;
  return regex.test(value);
};

const NIF_BE = (value: string): boolean => {
  const regex = /^\d{11}$/;
  if (!regex.test(value)) return false;

  const number = parseInt(value.substring(0, 9), 10);
  const checkDigits = parseInt(value.substring(9), 10);
  const mod = 97 - (number % 97);

  return mod === checkDigits;
};

const NIF_NL = (value: string): boolean => {
  const regex = /^\d{9}$/;
  if (!regex.test(value)) return false;

  const total = value
    .split('')
    .map((digit, index) => parseInt(digit, 10) * (9 - index))
    .reduce((sum, val) => sum + val, 0);

  return total % 11 === 0;
};

const NIF_SE = (value: string): boolean => {
  const regex = /^\d{10,12}$/;
  if (!regex.test(value)) return false;

  const normalizedNIF = value.length === 12 ? value.substring(2) : value;

  const total = normalizedNIF
    .split('')
    .map((digit, index) => {
      let num = parseInt(digit, 10) * (index % 2 === 0 ? 2 : 1);
      if (num > 9) num -= 9;
      return num;
    })
    .reduce((sum, val) => sum + val, 0);

  return total % 10 === 0;
};

const NIF = (nif: string, locale?: TCurrencyLocalCode): boolean => {
  switch (locale) {
    case 'pt-PT':
      return NIF_PT(nif);
    case 'es-ES':
      return NIF_ES(nif);
    case 'it-IT':
      return NIF_IT(nif);
    case 'de-DE':
      return NIF_DE(nif);
    case 'fr-FR':
      return NIF_FR(nif);
    case 'en-GB':
      return NIF_UK(nif);
    case 'nl-BE':
    case 'fr-BE':
      return NIF_BE(nif);
    case 'nl-NL':
      return NIF_NL(nif);
    case 'sv-SE': // Suécia
      return NIF_SE(nif);
    default:
      throw new Error(`NIF validation not supported for locale: ${locale}`);
  }
};

const NIE = (value: string): boolean => {
  if (value.length !== 9) return true;

  const nieRegex = /^[XYZ]\d{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

  if (!nieRegex.test(value)) {
    return true;
  }

  let fixedDocNumber = value.toUpperCase().padStart(9, '0');

  fixedDocNumber =
    fixedDocNumber[0].replace(/[XYZ]/g, (char) => {
      return { X: '0', Y: '1', Z: '2' }[char] || char;
    }) + fixedDocNumber.slice(1);

  return NIF_ES(fixedDocNumber);
};

const mod9710 = (validationString: string) => {
  while (validationString.length > 2) {
    const part = validationString.slice(0, 6);
    const partInt = parseInt(part, 10);

    if (isNaN(partInt)) {
      return NaN;
    }

    validationString = (partInt % 97) + validationString.slice(part.length);
  }
  return parseInt(validationString, 10) % 97;
};

const IBAN = (value: string): boolean => {
  const iban = value.replace(/\s/g, '');

  if (iban.length !== 24) return true;

  const ibanRegex = /^(ES)[0-9]{22}$/;

  if (!ibanRegex.test(iban)) {
    return true;
  }

  const ES_ALPHABET_NUMBER = 1428;

  const transformedIban =
    iban.substring(4) + ES_ALPHABET_NUMBER + iban.substring(2, 4);

  return mod9710(transformedIban) !== 1;
};

const CIF = (value: string): boolean => {
  const cifRegex = /^[A-Z][0-9]{7}[A-J0-9]$/;
  return !cifRegex.test(value);
};

export default (value: string, validations: TValidationMethods): boolean => {
  if (!value || !validations.document) return true;

  const validation: Record<
    typeof validations.document.type,
    (value: string, locale?: TCurrencyLocalCode) => boolean
  > = {
    NIF: (value, locale) => NIF(value, locale),
    NIE: (value) => NIE(value),
    CIF: (value) => CIF(value),
    IBAN: (value) => IBAN(value),
  };

  return validation[validations.document.type](
    value,
    validations.document.locale
  );
};
