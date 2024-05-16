import { ISchema } from '@/interfaces/schema';
import { BuildTree } from '../generators/formBuilder';
import {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useFormGroupContext } from '../context/FormGroupContext';
import FormCore from '@/core/form';

const Form = ({
  schema,
  index,
  initialValues,
  children,
}: PropsWithChildren<{
  schema?: ISchema;
  index: string;
  initialValues?: Record<string, unknown>;
}>) => {
  const { addForm, removeForm, getForm, mappers } = useFormGroupContext();
  const [tree, setTree] = useState<ReactElement>();

  useEffect(() => {
    const formInstance = new FormCore({ schema: schema, initialValues });
    addForm({ key: index, formInstance });

    const fields = getForm({ key: index })?.fields;

    fields &&
      getForm({ key: index })?.schema &&
      setTree(
        BuildTree({
          fields,
          mappers,
          formKey: index,
        })
      );
    return () => removeForm({ key: index });
  }, []);

  return (
    <form>
      <b style={{ padding: '0px', margin: '0px' }}>{`form index:${index}`}</b>
      <br></br>
      {tree && tree}
      {children && children}
    </form>
  );
};

export default Form;
