import { OutgoingHttpHeaders } from 'http2';

type TComponents = 'input' | 'div' | 'libinput' | 'dropdown' | 'datepicker';

type TProps = {
  label: string;
};

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

type TValidations = {
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
  validations: TValidations;
  fields: string[] | string;
};

type TResetValues = TVisibility & { resettedFields: string[] | string };

type TApi = {
  method: 'GET' | 'POST';
  url: string;
  headers?: OutgoingHttpHeaders;
  resultPath?: string;
};

type TSchema = {
  component: TComponents;
  props: Record<string, unknown>;
  name: string;
  validations?: Partial<Record<keyof HTMLElementEventMap, TValidations>>;
  visibilityConditions?: Partial<
    Record<keyof HTMLElementEventMap, TVisibility[]>
  >;
  resetValues?: Partial<Record<keyof HTMLElementEventMap, TResetValues[]>>;
  errorMessages?: Partial<Record<keyof TValidations, string>>;
  api?: Partial<
    Record<keyof HTMLElementEventMap, TApi> & { fallbackValue?: unknown }
  >;
  formatters?: TFormatters[];
  children?: TSchema[];
};

export { TSchema, TValidations, TVisibility, TResetValues, TApi, TFormatters };
