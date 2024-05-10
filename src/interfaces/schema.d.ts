import {
  TApi,
  TComponents,
  TErrorMessages,
  TFormatters,
  TProps,
  TResetValues,
  TValidations,
  TVisibilityContitions,
} from '@/types/schemaTypes';

interface ISchema {
  component: TComponents;
  props: TProps;
  name: string;
  validations?: TValidations;
  visibilityConditions?: TVisibilityContitions;
  resetValues?: TResetValues;
  errorMessages?: TErrorMessages;
  api?: TApi;
  formatters?: TFormatters[];
  children?: ISchema[];
}

export { ISchema };
