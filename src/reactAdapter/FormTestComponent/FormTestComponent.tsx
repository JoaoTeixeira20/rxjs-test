import { ReactElement, useEffect } from 'react';
import Form from '../form/Form';
import { schema } from '@/constants/schema';
import { useFormGroupContext } from '../context/FormGroupContext';
// import FieldWrapper from '../fieldWrapper/FieldWrapper';

const FormTestComponent = (): ReactElement => {
  const { getForm, mappers, printFormGroupInstance } = useFormGroupContext();

  useEffect(() => {
    getForm({ key: 'foo' })
      ?.fields.get('name')
      ?.emitValue({ value: '123456', event: 'ON_FIELD_CHANGE' });
    console.log(
      `value from name: ${getForm({ key: 'foo' })?.fields.get('name')?.value}`
    );
  }, []);

  const component = mappers.find((el) => el.componentName === 'dropdown');

  return (
    <>
      <button onClick={printFormGroupInstance}>print groupInstance</button>
      <button onClick={() => console.log(getForm({ key: 'foo' }))}>
        print foo formInstance
      </button>
      <button onClick={() => getForm({ key: 'foo' })?.printValues()}>
        print foo values
      </button>
      <Form
        index='foo'
        schema={schema}
        initialValues={{
          name: 'foo',
          bal: 'bal',
          baz: 'baz',
        }}
      >
        {/* {component && (
          <FieldWrapper
            Component={component.component}
            formKey='bar'
            index='mycustomdropdown'
            valueChangeEvent={component.valueChangeEvent}
          ></FieldWrapper>
        )} */}
      </Form>
      <Form index='bar'>{`insert asFormField components here (will be hard.. D:)`}</Form>
    </>
  );
};

export default FormTestComponent;
