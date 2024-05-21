import { Children, ReactElement, ReactNode, useEffect } from 'react';
import FieldWrapper from '../fieldWrapper/FieldWrapper';
import { IFormField } from '@/core/field';
import { TMapper } from '../mappers/mappers';
import { IComponentSchema, IFormSchema } from '@/interfaces/schema';

/**
 * @deprecated Use BuildTree instead
 */
const BuildReactTreeFromSchema = (schema: IFormSchema): ReactElement => {
  return <div>deprecated</div>;
};
// const BuildReactTreeFromSchema = (schema: ISchema): ReactElement => {
//   const { component, children, name } = schema;
//   const { mappers } = useFormContext();

//   const childElements = children
//     ? children.map((el: ISchema) => BuildReactTreeFromSchema(el))
//     : null;

//   const mapper = mappers.find((el) => el.componentName === component);

//   return mapper ? (
//     <FieldWrapper
//       key={name}
//       index={name}
//       Component={mapper.component}
//       valueChangeEvent={mapper.valueChangeEvent}
//     >
//       {childElements}
//     </FieldWrapper>
//   ) : (
//     <div>{`error rendering field ${name} :(`}</div>
//   );
// };

const BuildTree = ({
  fields,
  mappers,
  prevKey,
  formKey,
}: {
  fields: Map<string, IFormField>;
  mappers: TMapper[];
  prevKey?: string;
  formKey: string;
}): ReactElement => {
  if (!prevKey) {
    for (const [_, field] of fields) {
      if (!field.path && field.children.length > 0) {
        return BuildTree({ fields, mappers, prevKey: field.name, formKey });
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
        formKey={formKey}
      >
        {children.map((key) =>
          BuildTree({ fields, mappers, prevKey: key, formKey })
        )}
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
      formKey={formKey}
    />
  ) : (
    <div>{`error rendering field ${prevKey} :(`}</div>
  );
};

const BuildAsFormFieldTree = ({
  children,
}: {
  children?: ReactNode | undefined;
}): IComponentSchema[] | undefined => {
  //@ts-ignore
  return Children.map(children, (child: JSX.Element, index) => {
    if (!child?.type?.name || child.type.name !== 'AsFormField') {
      throw new Error('only use AsFormField inside the Form component');
      // console.log(child.type.name);
    }
    const struct = { ...child.props } as IComponentSchema;
    delete struct.children;

    const childElements = BuildAsFormFieldTree({
      children: child.props?.children,
    });

    return {
      ...struct,
      ...(childElements && { children: childElements }),
    };
  });
};

// const RenderSchema = () => {
//   const { printValues, printInstance, tree, getFieldInstance } =
//     useFormContext();
//   // const reactTree = BuildReactTreeFromSchema(schema);
//   // const reactTree = BuildTree(formInstance.fields, mappers);

//   return (
//     <>
//       <button onClick={printValues}>print values</button>
//       <button onClick={printInstance}>print instance</button>
//       <form>{tree}</form>
//     </>
//   );
// };

// export default RenderSchema;

export { BuildTree, BuildAsFormFieldTree };
