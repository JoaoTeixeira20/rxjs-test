import { ISchema } from '@/interfaces/schema';
import { BuildAsFormFieldTree, BuildTree } from '../generators/formBuilder';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
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
  const { addForm, removeForm, getForm, mappers } =
    useFormGroupContext();
  const [tree, setTree] = useState<ReactElement>();

  useEffect(() => {
    const formInstance = new FormCore({ schema: schema, initialValues });
    addForm({ key: index, formInstance });
    return () => removeForm({ key: index });
  }, []);

  useEffect(() => {
    const res = BuildAsFormFieldTree({ children });
    res?.[0] && getForm({ key: index })!.refreshFields(res?.[0]);

    const fields = getForm({ key: index })?.fields;
    fields &&
      setTree(
        BuildTree({
          fields,
          mappers,
          formKey: index,
        })
      );
  }, [children]);

  return (
    <form>
      <b style={{ padding: '0px', margin: '0px' }}>{`form index:${index}`}</b>
      <br></br>
      {tree && tree}
    </form>
  );
};

export default Form;
