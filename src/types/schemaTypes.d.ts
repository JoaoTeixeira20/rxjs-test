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
};

type TFormatters = 'dotEvery3chars' | 'capitalize' | 'onlyNumbers';

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

type TApi = Partial<
  Record<keyof HTMLElementEventMap, TApiConfig> & { fallbackValue?: unknown }
>;

export {
  TApi,
  TApiConfig,
  TErrorMessages,
  TResetValues,
  TVisibilityContitions,
  TValidations,
  TProps,
  TResetValueMethods,
  TFormatters,
  TComponents,
  TValidationMethods,
  TErrorList,
};
