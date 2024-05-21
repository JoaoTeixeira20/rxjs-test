import { IFormSchema } from '@/interfaces/schema';
import { BuildAsFormFieldTree, BuildTree } from '../generators/formBuilder';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { useFormGroupContext } from '../context/FormGroupContext';
import FormCore from '@/core/form';

const Form = ({
  schema,
  index,
  initialValues,
  action,
  method,
  children,
}: PropsWithChildren<
  {
    schema?: IFormSchema;
  } & Omit<IFormSchema, 'components'>
>) => {
  const { addForm, removeForm, getForm, mappers } = useFormGroupContext();
  const [tree, setTree] = useState<ReactElement>();

  useEffect(() => {
    const formIndex = index || schema?.index || 'defaultChange';
    if (formIndex === 'defaultChange') {
      console.warn(
        'please, add an unique id to the form, otherwise multiple forms will break'
      );
    }
    const formInstance = new FormCore({
      schema,
      initialValues: initialValues || schema?.initialValues,
      action: action || schema?.action,
      method: method || schema?.method,
      index: formIndex,
    });
    addForm({ key: formIndex, formInstance });
    return () => removeForm({ key: index });
  }, []);

  useEffect(() => {
    const schema = BuildAsFormFieldTree({ children });
    schema && getForm({ key: index })!.refreshFields(schema);

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
