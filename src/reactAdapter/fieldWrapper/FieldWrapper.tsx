import { IState } from '@/interfaces/state';
import { useFormContext } from '@/reactAdapter/context/FormContext';
import { TEvents } from '@/types/eventTypes';
import {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  PropsWithChildren,
  ReactElement,
  useMemo,
  ElementType,
} from 'react';

const FieldWrapper = ({
  index,
  Component,
  valueChangeEvent,
  children,
  onBlur,
  onChange,
  onFocus,
  onClick,
  onKeyUp,
  onKeyDown,
  value,
}: PropsWithChildren<{
  index: string;
  Component: ElementType;
  valueChangeEvent?: (event: unknown) => unknown;
  onBlur?: string;
  onChange?: string;
  onFocus?: string;
  onClick?: string;
  onKeyUp?: string;
  onKeyDown?: string;
  value?: unknown;
}>): ReactElement => {
  const { getFieldInstance } = useFormContext();
  const fieldInstance = useMemo(() => getFieldInstance(index), [index]);
  if (!fieldInstance) return <div>{`field ${index} not found :(`}</div>;
  const [valueState, setValueState] = useState(fieldInstance.value);
  const [state, setState] = useState<Partial<IState>>({ visibility: true });

  useEffect(() => {
    fieldInstance.mountField();

    fieldInstance.subscribeValue((value) => {
      setValueState(value);
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

  const mapProps = () => {
    const props: Record<string, unknown> = {};
    if (onBlur) props[onBlur] = () => handleEvent('ON_FIELD_BLUR');
    if (onChange) props[onChange] = handleChange;
    if (onFocus) props[onFocus] = () => handleEvent('ON_FIELD_FOCUS');
    if (onClick) props[onClick] = () => handleEvent('ON_FIELD_CLICK');
    if (onKeyUp) props[onKeyUp] = () => handleEvent('ON_FIELD_KEYUP');
    if (onKeyDown) props[onKeyDown] = () => handleEvent('ON_FIELD_KEYDOWN');
    props[(value as string) || 'value'] = valueState;
    return props;
  };

  return state?.visibility ? (
    <>
      <b style={{ padding: '0px', margin: '0px' }}>{index}</b>
      <Component
        {...state?.props}
        //onChange={handleChange}
        {...mapProps()}
        //value={valueState}
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
