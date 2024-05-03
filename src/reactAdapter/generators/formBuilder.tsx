import { TSchema } from "@/interfaces/schema";
import { ReactElement } from "react";
import { useFormContext } from "../context/FormContext";
import FieldWrapper from "../fieldWrapper/FieldWrapper";
import { TFormCore } from "@/core/form";

const BuildReactTree = (
  schema: TSchema,
  formInstance?: TFormCore
): ReactElement => {
  const { component, children, name } = schema;
  const { mappers } = useFormContext();

  const childElements = children
    ? children.map((el: TSchema) => BuildReactTree(el, formInstance))
    : null;

    const { component: Component, valueChangeEvent } = mappers.find(
      (el) => el.componentName === component
    );

  return (
    <FieldWrapper key={name} index={name} Component={Component} valueChangeEvent={valueChangeEvent}>
      {childElements}
    </FieldWrapper>
  );
};

const RenderSchema = () => {
  const { schema, formInstance, printValues } = useFormContext();
  const reactTree = BuildReactTree(schema, formInstance);

  return (
    <>
      <button onClick={printValues}>print values</button>
      <form>{reactTree}</form>
    </>
  );
};

export default RenderSchema;

export { BuildReactTree };
