import FormCore, { TFormCore } from '@/core/form';
import { TMapper } from '@/reactAdapter/mappers/mappers';
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
  useRef,
} from 'react';
import FormGroup, { TFormGroup } from '@/core/formGroup';

type TFormContext = {
  addForm: (payload: { key: string; formInstance: TFormCore }) => void;
  getForm: (payload: { key: string }) => FormCore | undefined;
  removeForm: (payload: { key: string }) => void;
  formGroupInstance: TFormGroup;
  mappers: TMapper[];
  printFormGroupInstance: () => void;
};

type TFormContextProvider = {
  mappers: TMapper[];
};

let context: TFormContext;

const FormGroupContext = createContext<TFormContext>({} as TFormContext);

const FormGroupContextProvider = ({
  children,
  mappers,
}: PropsWithChildren<TFormContextProvider>): ReactElement => {
  const formGroupInstance = useRef<TFormGroup>(new FormGroup());

  const addForm = ({
    key,
    formInstance,
  }: {
    key: string;
    formInstance: TFormCore;
  }) => {
    formGroupInstance.current.addForm({ key, formInstance });
  };

  const removeForm = ({ key }: { key: string }) => {
    formGroupInstance.current.removeForm({ key });
  };

  const getForm = ({ key }: { key: string }) =>
    formGroupInstance.current.getForm({ key });

  const printFormGroupInstance = () => {
    console.log(formGroupInstance.current.printFormGroupInstance());
  };

  const contextValue = {
    addForm,
    getForm,
    removeForm,
    mappers,
    formGroupInstance: formGroupInstance.current,
    printFormGroupInstance,
  };

  return (
    <FormGroupContext.Provider value={contextValue}>
      {children}
    </FormGroupContext.Provider>
  );
};

const useFormGroupContext = (): TFormContext => {
  context = useContext(FormGroupContext);

  if (typeof context === 'undefined') {
    throw new Error(`useFormContext must be used within a FormContextProvider`);
  }

  return context;
};

export { FormGroupContext, FormGroupContextProvider, useFormGroupContext };
