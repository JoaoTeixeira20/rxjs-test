import { ISchema } from '@/interfaces/schema';
import { BuildAsFormFieldTree, BuildTree } from '../generators/formBuilder';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { useFormGroupContext } from '../context/FormGroupContext';
import FormCore from '@/core/form';

const Form = ({
  schema,
  index,
  initialValues,
  onSubmit,
  children,
}: PropsWithChildren<{
  schema?: ISchema[];
  index: string;
  initialValues?: Record<string, unknown>;
  onSubmit?: () => void;
}>) => {
  const { addForm, removeForm, getForm, mappers } =
    useFormGroupContext();
  const [tree, setTree] = useState<ReactElement>();

  useEffect(() => {
    const formInstance = new FormCore({ schema: schema, initialValues, onSubmit });
    addForm({ key: index, formInstance });
    return () => removeForm({ key: index });
  }, []);

  useEffect(() => {
    const schema = BuildAsFormFieldTree({ children });
    schema?.[0] && getForm({ key: index })!.refreshFields(schema);

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
