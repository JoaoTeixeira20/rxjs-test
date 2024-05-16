import { IState } from '@/interfaces/state';
import { TEvents } from '@/types/eventTypes';
import {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  PropsWithChildren,
  ReactElement,
  ElementType,
} from 'react';
import { useFormGroupContext } from '../context/FormGroupContext';

const FieldWrapper = ({
  index,
  Component,
  valueChangeEvent,
  formKey,
  children,
}: PropsWithChildren<{
  index: string;
  Component: ElementType;
  valueChangeEvent?: (event: unknown) => unknown;
  formKey: string;
}>): ReactElement => {
  const { formGroupInstance } = useFormGroupContext();
  const fieldInstance = formGroupInstance
    .getForm({ key: formKey })
    ?.getField({ key: index });
  if (!fieldInstance) return <div>{`field ${index} not found :(`}</div>;
  const [value, setValue] = useState(fieldInstance.value);
  const [state, setState] = useState<Partial<IState>>({ visibility: true });

  useEffect(() => {
    fieldInstance.mountField();

    fieldInstance.subscribeValue((value) => {
      setValue(value);
    });

    fieldInstance.subscribeState(
      ({ errors, visibility, apiResponse, props }) => {
        setState((prev) => {
          // console.log("updated state onto", index);
          // console.log({value, errors, visibility, apiResponse, props});
          return {
            ...prev,
            errors,
            visibility,
            apiResponse,
            props,
          };
        });
      }
    );

    return () => {
      fieldInstance.destroyField();
    };
  }, []);

  const handleChange = useCallback((event: unknown) => {
    let value;
    if (valueChangeEvent) {
      value = valueChangeEvent(event);
      fieldInstance.emitValue({ value, event: 'ON_FIELD_CHANGE' });
      return;
    }
    value = (event as SyntheticEvent<HTMLInputElement>).currentTarget.value;
    fieldInstance.emitValue({ value, event: 'ON_FIELD_CHANGE' });
  }, []);

  const handleEvent = useCallback((event: TEvents) => {
    fieldInstance.emitEvents({ event });
  }, []);

  // useEffect(() => {
  //   console.log(
  //     `AAAAAAAAAAAAAAAAAAAAAAAA: value: ${value} key ${fieldInstance.name}`
  //   );
  // }, [value]);

  return state?.visibility ? (
    <>
      <b style={{ padding: '0px', margin: '0px' }}>{index}</b>
      <Component
        {...state?.props}
        onChange={handleChange}
        onBlur={() => handleEvent('ON_FIELD_BLUR')}
        value={value}
      >
        {children && children}
      </Component>
      {/* {errors.length > 0 &&
          errors.map((error) => (
            <div key={error} style={{ color: 'red' }}>
              {error}
            </div>
          ))}
        {apiResponse && <div>{JSON.stringify(apiResponse)}</div>} */}
    </>
  ) : (
    <></>
  );
};

export default FieldWrapper;
