import { ISchema } from '@/interfaces/schema';
import { PropsWithChildren, ReactElement } from 'react';

const AsFormField = (
  props: PropsWithChildren<Omit<ISchema, 'children'>>
): ReactElement => {
  return <>{props.children}</>;
};

export default AsFormField;
