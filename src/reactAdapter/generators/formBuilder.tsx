import { TSchema } from '@/interfaces/schema';
import { ReactElement } from 'react';
import { useFormContext } from '../context/FormContext';
import FieldWrapper from '../fieldWrapper/FieldWrapper';
import { IFormField } from '@/core/field';
import { TMapper } from '../mappers/mappers';

/**
 * @deprecated Use BuildTree instead
 */
const BuildReactTreeFromSchema = (schema: TSchema): ReactElement => {
  const { component, children, name } = schema;
  const { mappers } = useFormContext();

  const childElements = children
    ? children.map((el: TSchema) => BuildReactTreeFromSchema(el))
    : null;

  const { component: Component, valueChangeEvent } = mappers.find(
    (el) => el.componentName === component
  );

  return (
    <FieldWrapper
      key={name}
      index={name}
      Component={Component}
      valueChangeEvent={valueChangeEvent}
    >
      {childElements}
    </FieldWrapper>
  );
};

const BuildTree = (
  fields: Map<string, IFormField>,
  mappers: TMapper[],
  prevKey?: string
): ReactElement => {
  if (!prevKey) {
    for (const [_, field] of fields) {
      if (!field.path) {
        return BuildTree(fields, mappers, field.name);
      }
    }
  }
  const children = fields.get(prevKey).children;
  if (children && children.length > 0) {
    const { component: Component, valueChangeEvent } = mappers.find(
      (el) => el.componentName === fields.get(prevKey).component
    );

    return (
      <FieldWrapper
        Component={Component}
        index={prevKey}
        valueChangeEvent={valueChangeEvent}
        key={prevKey}
      >
        {children.map((key) => BuildTree(fields, mappers, key))}
      </FieldWrapper>
    );
  }
  const { component: Component, valueChangeEvent } = mappers.find(
    (el) => el.componentName === fields.get(prevKey).component
  );
  return (
    <FieldWrapper
      Component={Component}
      index={prevKey}
      valueChangeEvent={valueChangeEvent}
      key={prevKey}
    />
  );
};

const RenderSchema = () => {
  const { printValues, printInstance, formInstance, mappers, schema, tree } =
    useFormContext();
  // const reactTree = BuildReactTreeFromSchema(schema);
  // const reactTree = BuildTree(formInstance.fields, mappers);

  return (
    <>
      <button onClick={printValues}>print values</button>
      <button onClick={printInstance}>print instance</button>
      <form>{tree}</form>
    </>
  );
};

export default RenderSchema;

export { BuildTree };
