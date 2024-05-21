import { IFormSchema } from '@/interfaces/schema';
import { BuildAsFormFieldTree, BuildTree } from '../generators/formBuilder';
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFormGroupContext } from '../context/FormGroupContext';
import FormCore from '@/core/form';
import { TFormValues } from '@/types/formTypes';

const Form = ({
  schema,
  index,
  initialValues,
  action,
  method,
  onSubmit,
  children,
}: PropsWithChildren<
  {
    schema?: IFormSchema;
    onSubmit?: (data: TFormValues) => void;
  } & Omit<IFormSchema, 'components'>
>) => {
  const { addForm, removeForm, getForm, mappers } = useFormGroupContext();
  const [tree, setTree] = useState<ReactNode>();
  const schemaIndex = useMemo(
    () => index || schema?.index || 'defaultChange',
    [index, schema]
  );

  useEffect(() => {
    if (schemaIndex === 'defaultChange') {
      console.warn(
        'please, add an unique id to the form, otherwise multiple forms will break'
      );
    }
    const formInstance = new FormCore({
      schema,
      initialValues: initialValues || schema?.initialValues,
      action: action || schema?.action,
      method: method || schema?.method,
      index: schemaIndex,
      onSubmit,
    });
    addForm({ key: schemaIndex, formInstance });
    return () => removeForm({ key: index });
  }, []);

  useEffect(() => {
    const schema = BuildAsFormFieldTree({ children });
    schema && getForm({ key: index })!.refreshFields(schema);

    const fields = getForm({ key: index })?.fields;
    if (fields) {
      const buildTree = BuildTree({
        fields,
        mappers,
        formKey: index,
      });
      // console.log(buildTree);
      setTree(buildTree);
    }
  }, [children]);

  return (
    <form>
      <b
        style={{ padding: '0px', margin: '0px' }}
      >{`form index:${schemaIndex}`}</b>
      <br></br>
      {tree && tree}
    </form>
  );
};

export default Form;
