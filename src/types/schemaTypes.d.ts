import { OutgoingHttpHeaders } from 'http2';
import { TEvents } from './eventTypes';

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
  fallbackValue?: unknown;
};

type TProps = Record<string, unknown>;

type TValidations = Partial<
  Record<TEvents, TValidationMethods>
>;

type TVisibilityContitions = Partial<
  Record<TEvents, TVisibility[]>
>;

type TResetValues = Partial<
  Record<TEvents, TResetValueMethods[]>
>;

type TErrorMessages = Partial<Record<keyof TValidationMethods, string>>;

type TApi = { config: TApiConfig; events: Partial<TEvents>[] };

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
