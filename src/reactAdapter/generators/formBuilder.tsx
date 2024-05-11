import { ReactElement } from 'react';
import { useFormContext } from '../context/FormContext';
import FieldWrapper from '../fieldWrapper/FieldWrapper';
import { IFormField } from '@/core/field';
import { TMapper } from '../mappers/mappers';
import { ISchema } from '@/interfaces/schema';

/**
 * @deprecated Use BuildTree instead
 */
const BuildReactTreeFromSchema = (schema: ISchema): ReactElement => {
  const { component, children, name } = schema;
  const { mappers } = useFormContext();

  const childElements = children
    ? children.map((el: ISchema) => BuildReactTreeFromSchema(el))
    : null;

  const mapper = mappers.find((el) => el.componentName === component);

  return mapper ? (
    <FieldWrapper
      key={name}
      index={name}
      Component={mapper.component}
      valueChangeEvent={mapper.valueChangeEvent}
    >
      {childElements}
    </FieldWrapper>
  ) : (
    <div>{`error rendering field ${name} :(`}</div>
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

  const children =
    prevKey && fields.has(prevKey) && fields.get(prevKey)!.children;
  if (children && children.length > 0) {
    const mapper = mappers.find(
      (el) => el.componentName === fields.get(prevKey)!.component
    );

    return mapper ? (
      <FieldWrapper
        Component={mapper.component}
        index={prevKey}
        valueChangeEvent={mapper.valueChangeEvent}
        key={prevKey}
      >
        {children.map((key) => BuildTree(fields, mappers, key))}
      </FieldWrapper>
    ) : (
      <div>{`error rendering field ${prevKey} :(`}</div>
    );
  }
  const mapper =
    prevKey &&
    mappers.find((el) => el.componentName === fields.get(prevKey)!.component);
    
  return mapper ? (
    <FieldWrapper
      Component={mapper.component}
      index={prevKey}
      valueChangeEvent={mapper.valueChangeEvent}
      key={prevKey}
    />
  ) : (
    <div>{`error rendering field ${prevKey} :(`}</div>
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
