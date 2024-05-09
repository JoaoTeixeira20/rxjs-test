import { useFormContext } from "@/reactAdapter/context/FormContext";
import {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  PropsWithChildren,
  ReactElement,
  useMemo,
  ElementType,
} from "react";

const FieldWrapper = ({
  index,
  Component,
  valueChangeEvent,
  children,
}: PropsWithChildren<{
  index: string;
  Component: ElementType;
  valueChangeEvent: (event: unknown) => unknown;
}>): ReactElement => {
  const { getFieldInstance } = useFormContext();
  const fieldInstance = useMemo(() => getFieldInstance(index), [index]);
  const [value, setValue] = useState(fieldInstance.value);
  const [{ errors, visibility, apiResponse, props }, setState] = useState<{
    errors: string[];
    visibility: boolean;
    apiResponse: unknown;
    props: Record<string, unknown>;
  }>({
    errors: [],
    visibility: fieldInstance.visibility,
    apiResponse: fieldInstance.apiResponseData?.response,
    props: fieldInstance.props,
  });

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
      fieldInstance.emitValue({ value, event: "input" });
      return;
    }
    value = (event as SyntheticEvent<HTMLInputElement>).currentTarget.value;
    fieldInstance.emitValue({ value, event: "input" });
  }, []);

  // useEffect(() => {
  //   console.log(
  //     `AAAAAAAAAAAAAAAAAAAAAAAA: value: ${value} key ${fieldInstance.name}`
  //   );
  // }, [value]);

  return (
    visibility && (
      <>
        <b style={{ padding: "0px", margin: "0px" }}>{index}</b>
        <Component {...props} onChange={handleChange} value={value}>
          {children && children}
        </Component>
        {errors.length > 0 &&
          errors.map((error) => (
            <div key={error} style={{ color: "red" }}>
              {error}
            </div>
          ))}
        {apiResponse && <div>{JSON.stringify(apiResponse)}</div>}
      </>
    )
  );
};

export default FieldWrapper;
