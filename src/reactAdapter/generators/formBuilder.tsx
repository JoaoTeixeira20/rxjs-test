import { TSchema } from "@/interfaces/schema";
import { ReactElement } from "react";
import { useFormContext } from "../context/FormContext";
import FieldWrapper from "../fieldWrapper/FieldWrapper";
import { TFormCore } from "@/core/form";

const BuildReactTree = (
  schema: TSchema,
): ReactElement => {
  const { component, children, name } = schema;
  const { mappers } = useFormContext();

  const childElements = children
    ? children.map((el: TSchema) => BuildReactTree(el))
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
  const { schema, printValues, printInstance } = useFormContext();
  const reactTree = BuildReactTree(schema);

  return (
    <>
      <button onClick={printValues}>print values</button>
      <button onClick={printInstance}>print instance</button>
      <form>{reactTree}</form>
    </>
  );
};

export default RenderSchema;

export { BuildReactTree };
