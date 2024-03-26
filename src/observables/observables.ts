import { TFormStructure } from "@/interfaces/structure";
import { Observable, merge } from "rxjs";

const observablesList$: Observable<{ value: unknown; key: string }>[] = [];
const validationEvents$: Observable<{
  key: string;
  type: keyof HTMLElementEventMap;
}>[] = [];

const mergeObservables = (structure: TFormStructure) => {
  merge(...observablesList$).subscribe(({ value, key }) => {
    const currentValue = structure.get(key);
    currentValue.value = value;
    structure.set(key, currentValue);
    console.log(`${key} changed to ${value}`);
  });
};

const mergeValidations = (structure: TFormStructure) => {
  merge(...validationEvents$).subscribe(({ key, type }) => {
    const validations = structure.get(key).validations as Partial<
      Record<
        keyof HTMLElementEventMap,
        {
          max?: number;
          min?: number;
          required?: boolean;
        }
      >
    >;

    const validationEvents = validations[type as keyof HTMLElementEventMap];
    console.log(validationEvents);
  });
};

export {
  observablesList$,
  validationEvents$,
  mergeObservables,
  mergeValidations,
};
