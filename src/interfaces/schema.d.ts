type TComponents = "input" | "div";

type TProps = {
  label: string;
};

type TSchema = {
  component: TComponents;
  props: TProps;
  name: string;
  validations?: Partial<Record<keyof HTMLElementEventMap, unknown>>;
  children?: TSchema[];
};

export { TSchema };
