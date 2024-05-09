import FormField from "@/core/field";
import FormCore, { TFormCore } from "@/core/form";
import { IFormCore } from "@/interfaces/formCore";
import { TSchema } from "@/interfaces/schema";
import { TMapper } from "@/reactAdapter/mappers/mappers";
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
  useRef,
} from "react";

type TFormContext = {
  formInstance: TFormCore;
  schema: TSchema;
  mappers: TMapper[];
  printValues: () => void;
  printInstance: () => void;
  getFieldInstance: (index: string) => FormField;
};

type TFormContextProvider = {
  schema: TSchema;
  mappers: TMapper[];
  initialValues?: Record<string, unknown>;
};

let context: TFormContext;

const FormContext = createContext<TFormContext>({} as TFormContext);

const FormContextProvider = ({
  children,
  schema,
  mappers,
  initialValues,
}: PropsWithChildren<TFormContextProvider>): ReactElement => {
  const formInstance = useRef<TFormCore>(
    new FormCore({ schema, initialValues })
  );

  const printValues = () => {
    formInstance.current.printValues();
  };

  const printInstance = () => {
    console.log(formInstance);
  };

  const getFieldInstance = (index: string): FormField =>
    formInstance.current.fields.get(index);

  const contextValue = {
    formInstance: formInstance.current,
    getFieldInstance,
    schema,
    mappers,
    printValues,
    printInstance,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};

const useFormContext = (): TFormContext => {
  context = useContext(FormContext);

  if (typeof context === "undefined") {
    throw new Error(`useFormContext must be used within a FormContextProvider`);
  }

  return context;
};

export { FormContext, FormContextProvider, useFormContext };
