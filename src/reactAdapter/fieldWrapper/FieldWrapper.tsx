import { TMapper } from "@/mappers/mappers";
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
  valueChangeEvent: (event: unknown) => unknown
}>): ReactElement => {
  const { getFieldInstance } = useFormContext();
  const fieldInstance = useMemo(() => getFieldInstance(index), [index]);

  const [{ value, errors, visibility, apiResponse, props }, setState] =
    useState<{
      value: unknown;
      errors: string[];
      visibility: boolean;
      apiResponse: unknown;
      props: Record<string, unknown>;
    }>({
      value: fieldInstance.value,
      errors: [],
      visibility: fieldInstance.visibility,
      apiResponse: fieldInstance.apiResponseData?.response,
      props: fieldInstance.props,
    });

  console.log("rerendered", index, fieldInstance.value);

  useEffect(() => {
    fieldInstance.mountField();

    fieldInstance.subscribeState(
      ({ value, errors, visibility, apiResponse, props }) => {
        setState((prev) => ({
          ...prev,
          value,
          errors,
          visibility,
          apiResponse,
          props,
        }));
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

  return (
    visibility && (
      <>
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
