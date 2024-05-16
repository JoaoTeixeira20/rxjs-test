import FormField from '@/core/field';
import FormCore, { TFormCore } from '@/core/form';
import { TMapper } from '@/reactAdapter/mappers/mappers';
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
  useRef,
} from 'react';
// import { BuildTree } from '../generators/formBuilder';
import { ISchema } from '@/interfaces/schema';

type TFormContext = {
  formInstance: TFormCore;
  schema?: ISchema;
  // tree: ReactElement;
  mappers: TMapper[];
  printValues: () => void;
  printInstance: () => void;
  getFieldInstance: (index: string) => FormField | undefined;
};

type TFormContextProvider = {
  schema?: ISchema;
  mappers: TMapper[];
  initialValues?: Record<string, unknown>;
};

let context: TFormContext;

/** @deprecated */
const FormContext = createContext<TFormContext>({} as TFormContext);

/** @deprecated */
const FormContextProvider = ({
  children,
  schema,
  mappers,
  initialValues,
}: PropsWithChildren<TFormContextProvider>): ReactElement => {
  const formInstance = useRef<TFormCore>(
    new FormCore({ schema, initialValues })
  );

  // const tree = useRef<ReactElement>(
  //   BuildTree(formInstance.current.fields, mappers)
  // );

  const printValues = () => {
    formInstance.current.printValues();
  };

  const printInstance = () => {
    console.log(formInstance);
  };

  const getFieldInstance = (index: string): FormField | undefined => {
    if (formInstance.current.fields.has(index))
      return formInstance.current.fields.get(index);
    console.warn(`failed to getFieldInstance on ${index}`);
  };

  const contextValue = {
    formInstance: formInstance.current,
    getFieldInstance,
    schema,
    // tree: tree.current,
    mappers,
    printValues,
    printInstance,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};

/** @deprecated */
const useFormContext = (): TFormContext => {
  context = useContext(FormContext);

  if (typeof context === 'undefined') {
    throw new Error(`useFormContext must be used within a FormContextProvider`);
  }

  return context;
};

export { FormContext, FormContextProvider, useFormContext };
