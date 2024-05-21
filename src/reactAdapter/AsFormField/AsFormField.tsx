import { IComponentSchema } from '@/interfaces/schema';
import { PropsWithChildren, ReactElement } from 'react';

const AsFormField = (
  props: PropsWithChildren<Omit<IComponentSchema, 'children'>>
): ReactElement => {
  return <>{props.children}</>;
};

export default AsFormField;
