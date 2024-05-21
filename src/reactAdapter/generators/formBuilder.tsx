import { Children, ReactElement, ReactNode } from 'react';
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
  prevPath,
  formKey,
}: {
  fields: Map<string, IFormField>;
  mappers: TMapper[];
  prevPath?: string;
  formKey: string;
}): ReactNode => {
  return Array.from(fields)
    .filter(([, value]) => {
      return value.path === prevPath;
    })
    .map(([, value]) => {
      const fieldName = value.name;

      const mapper = mappers.find(
        (el) => el.componentName === fields.get(fieldName)!.component
      );

      const children = BuildTree({
        fields,
        mappers,
        prevPath: `${prevPath ? `${prevPath}.` : ``}${value.name}`,
        formKey,
      });

      const lenght = Children.count(children);

      return mapper && lenght > 0 ? (
        <FieldWrapper
          Component={mapper.component}
          index={fieldName}
          valueChangeEvent={mapper.valueChangeEvent}
          key={fieldName}
          formKey={formKey}
        >
          {children}
        </FieldWrapper>
      ) : (
        mapper ? (
          <FieldWrapper
            Component={mapper.component}
            index={fieldName}
            valueChangeEvent={mapper.valueChangeEvent}
            key={fieldName}
            formKey={formKey}
          ></FieldWrapper>
        ) : <div>{`failed to render field on tree.. :(`}</div>)
    });
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

export { BuildTree, BuildAsFormFieldTree };
