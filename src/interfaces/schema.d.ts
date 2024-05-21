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

interface IComponentSchema {
  component: string;
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

interface IFormSchema {
  index: string;
  action?: string;
  method?: string;
  initialValues?: Record<string, unknown>;
  components?: IComponentSchema[];
}

export { IFormSchema, IComponentSchema };
