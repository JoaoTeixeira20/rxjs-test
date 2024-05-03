type TComponents = "input" | "div" | 'libinput' | 'dropdown' | 'datepicker';

type TProps = {
  label: string;
};

type TValidations = {
  max?: number;
  min?: number;
  required?: boolean;
};

type TVisibility = {
  validations: TValidations;
  fields: string[] | string;
};

type TResetValues = TVisibility & { resettedFields: string[] | string };

type TApi = {
  method: "GET" | "POST";
  url: string;
  valuePath: string;
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
  api?: Partial<Record<keyof HTMLElementEventMap, TApi>>;
  children?: TSchema[];
};

export { TSchema, TValidations, TVisibility, TResetValues, TApi };
