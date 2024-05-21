import { ReactElement, useEffect, useState } from 'react';
import Form from '../form/Form';
import { schema } from '@/constants/schema';
import { useFormGroupContext } from '../context/FormGroupContext';
import AsFormField from '../AsFormField/AsFormField';
// import FieldWrapper from '../fieldWrapper/FieldWrapper';

const FormTestComponent = (): ReactElement => {
  const { getForm, mappers, printFormGroupInstance } = useFormGroupContext();
  const [length, setLength] = useState(0);

  useEffect(() => {
    getForm({ key: 'foo' })
      ?.getField({ key: 'name' })
      ?.emitValue({ value: '123456', event: 'ON_FIELD_CHANGE' });
    console.log(
      `value from name: ${getForm({ key: 'foo' })?.fields.get('name')?.value}`
    );

    const sub = getForm({ key: 'foo' })
      ?.getField({ key: 'provinces' })
      ?.propsSubject$.subscribe((props) => {
        // props?.optionList?.[0]?.id &&
        getForm({ key: 'foo' })?.getField({ key: 'provinces' })?.emitValue({
          // @ts-ignore
          value: props?.optionList?.[0]?.id,
          event: 'ON_FIELD_CHANGE',
        });
      });
    return () => sub?.unsubscribe();
  }, []);

  const handleAdd = () => {
    setLength((prev) => prev + 1);
  };

  const handleRemove = () => {
    setLength((prev) => prev - 1);
  };

  return (
    <>
      <button onClick={printFormGroupInstance}>print groupInstance</button>
      <button onClick={() => console.log(getForm({ key: 'foo' }))}>
        print foo formInstance
      </button>
      <button onClick={() => getForm({ key: 'foo' })?.printValues()}>
        print foo values
      </button>
      <button onClick={() => console.log(getForm({ key: 'foo' })?.isValid)}>
        print foo validate
      </button>
      <Form
        index='foo'
        schema={schema}
        initialValues={{
          name: 'foo',
          bal: 'bal',
          baz: 'baz',
        }}
      ></Form>
      {/* <Form index='bar'>
        <AsFormField
          component='libinput'
          name='testinputoutside'
          props={{ label: 'testinput' }}
        ></AsFormField>
        <AsFormField component='div' name='foo' props={{ label: 'foo' }}>
          <AsFormField
            component='libinput'
            name='bar'
            props={{ label: 'bar' }}
          ></AsFormField>
          <AsFormField
            component='libinput'
            name='baz'
            props={{ label: 'baz' }}
          ></AsFormField>
          <AsFormField component='div' name='bal' props={{ label: 'bal' }}>
            {Array(length)
              .fill(0)
              .map((_, index) => (
                <AsFormField
                  key={index}
                  component='libinput'
                  name={`test_${index}`}
                  props={{ label: '${bar.value}' }}
                  // props={{ label: `test_${index}` }}
                  validations={{
                    ON_FIELD_CHANGE: {
                      max: 20,
                      min: 10,
                    },
                  }}
                  errorMessages={{
                    max: 'max reached',
                    min: 'min reached',
                  }}
                />
              ))}
          </AsFormField>
        </AsFormField>
      </Form> */}
      <button onClick={handleAdd}>add field</button>
      <button onClick={handleRemove}>remove field</button>
    </>
  );
};

export default FormTestComponent;
