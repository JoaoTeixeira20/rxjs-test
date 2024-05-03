import { Subject } from "rxjs";
import { TSchema, TValidations } from "./schema";
import { TFormStructure } from "./structure";

interface IFormCore {
  structure: TFormStructure;
  schema: TSchema;
  values: Map<string, unknown>;
  errors: Map<string, Record<string, keyof TValidations>>;
  subjects: Map<
    string,
    Subject<{ value: string; event: keyof HTMLElementEventMap }>
  >;
  initializeStructure: () => void;
  // setSubject: (key: string) => void;
  emitValue: (
    key: string,
    value: unknown,
    event: keyof HTMLElementEventMap
  ) => void;
  validateField: (key: string, event: keyof HTMLElementEventMap) => void;
  destroyField: (key: string) => void;
}

export { IFormCore };
