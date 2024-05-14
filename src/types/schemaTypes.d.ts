import { ICurrencyCode } from '@/helpers/currencyCode';
import { OutgoingHttpHeaders } from 'http2';

type TComponents = 'input' | 'div' | 'libinput' | 'dropdown' | 'datepicker';

// Validation types
type TLengthValidation = {
  rule:
    | 'equal'
    | 'notEqual'
    | 'less'
    | 'lessOrEqual'
    | 'greater'
    | 'greaterOrEqual';
  target: number;
};
type TCallbackValidation = (value: unknown) => boolean;
type TBetweenValidation = {
  start: number;
  end: number;
};
type TCreditCardMatch = { numberCard: string; availableOptions: string[] };

type TValidationMethods = {
  max?: number;
  min?: number;
  length?: TLengthValidation;
  required?: boolean;
  greaterThan?: number;
  value?: unknown;
  regex?: string;
  email?: boolean;
  url?: boolean;
  onlyLetters?: boolean;
  notAllowSpaces?: boolean;
  callback?: TCallbackValidation;
  isNumber?: boolean;
  hasNoExtraSpaces?: boolean;
  notEmpty?: boolean;
  between?: TBetweenValidation;
  sequential?: boolean;
  repeated?: boolean;
  includes?: string[] | number[];
  isCreditCard?: string[];
  isCreditCodeMatch?: TCreditCardMatch;
  isCreditCardAndLength?: string[];
};

// Formatter types
type TSplitterFormatterValue = {
  value: string;
  position: number;
};

type TFormatters = {
  dotEvery3chars?: boolean;
  capitalize?: boolean;
  uppercase?: boolean;
  onlyNumbers?: boolean;
  onlyLetters?: boolean;
  onlyFloatNumber?: Pick<TCurrencyMask, 'precision' | 'decimal'>;
  regex?: string;
  gapsCreditCard?: string[];
  callback?: (value: unknown) => unknown;
  splitter?: TSplitterFormatterValue[];
  undo_splitter?: TSplitterFormatterValue[];
};

// Mask types
/**
 * @param align - Prefix alignment in text. (default: right)
 * @param decimal - Separator of decimals (default: '.')
 * @param precision - Number of decimal places (default: 2)
 * @param prefix - Money prefix (default: '$')
 * @param thousands - Separator of thousands (default: ',')
 */
type TCurrencyMask = {
  align?: 'left' | 'right';
  decimal?: string;
  precision?: number;
  prefix?: ICurrencyCode;
  thousands?: string;
};
type TMaskGeneric = {
  to: number;
  from: number;
  mask: string;
};

type TMasks = {
  currency?: TCurrencyMask;
  generic?: TMaskGeneric[];
  secureCreditCard?: boolean;
  card?: boolean;
  cardDate?: boolean;
  fein?: boolean;
  replaceAll?: string | number;
  callback?(value: unknown): string;
};

type TVisibility = {
  validations: TValidationMethods;
  fields: string[] | string;
};

type TResetValueMethods = TVisibility & { resettedFields: string[] | string };

type TApiConfig = {
  method: 'GET' | 'POST';
  url: string;
  headers?: OutgoingHttpHeaders;
  resultPath?: string;
  fallbackValue?: unknown;
};

type TProps = Record<string, unknown>;

type TValidations = Partial<
  Record<keyof HTMLElementEventMap, TValidationMethods>
>;

type TVisibilityContitions = Partial<
  Record<keyof HTMLElementEventMap, TVisibility[]>
>;

type TResetValues = Partial<
  Record<keyof HTMLElementEventMap, TResetValueMethods[]>
>;

type TErrorMessages = Partial<Record<keyof TValidationMethods, string>>;

type TErrorList = Partial<Record<keyof TValidationMethods, string>>;

type TApi = {
  config: TApiConfig;
  events: Partial<keyof HTMLElementEventMap>[];
};

export {
  TApi,
  TApiConfig,
  TErrorMessages,
  TResetValues,
  TVisibilityContitions,
  TValidations,
  TMasks,
  TProps,
  TResetValueMethods,
  TFormatters,
  TComponents,
  TValidationMethods,
  TErrorList,
};
