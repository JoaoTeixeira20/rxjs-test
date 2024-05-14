import {
  TApi,
  TComponents,
  TErrorMessages,
  TFormatters,
  TMasks,
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
  formatters?: TFormatters;
  masks?: TMasks;
  children?: ISchema[];
}

export { ISchema };
