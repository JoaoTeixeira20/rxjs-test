import { ISchema } from '@/interfaces/schema';
import { FormContextProvider } from '../context/FormContext';
import RenderSchema from '../generators/formBuilder';
import { TMapper } from '@/reactAdapter/mappers/mappers';

const Form = (props: {
  schema: ISchema;
  mappers: TMapper[];
  initialValues?: Record<string, unknown>;
}) => {
  return (
    <FormContextProvider {...props}>
      <RenderSchema></RenderSchema>
    </FormContextProvider>
  );
};

export default Form;
