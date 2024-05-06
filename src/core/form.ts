import { TSchema, TValidations } from "@/interfaces/schema";
import FormField, { IFormField } from "./field";
import { validations } from "@/core/validations/validations";
import { traverseObject } from "@/helpers/helpers";
import { Subject } from "rxjs";
import get from "lodash/get";
import set from "lodash/set";

class FormCore {
  schema: TSchema;
  fields: Map<string, IFormField>;
  initialValues?: Record<string, unknown>;
  templateSubject$?: Subject<{ key: string }>;
  subscribedTemplates?: {
    origin: string;
    destination: string;
    destinationPath: string;
    originParh: string;
  }[];
  constructor({
    schema,
    initialValues,
  }: {
    schema: TSchema;
    initialValues?: Record<string, unknown>;
  }) {
    this.schema = schema;
    this.fields = new Map();
    this.initialValues = initialValues;
    const indexes = FormCore.checkIndexes(schema);
    if (indexes.length > new Set(indexes).size)
      throw new Error("duplicate indexes while generating the schema");
    this.templateSubject$ = new Subject();
    this.subscribedTemplates = [];
    this.serializeStructure(this.schema);
    this.subscribeTemplates();
    this.templateSubject$.subscribe(({ key }) => {
      this.subscribedTemplates.map((el) => {
        if (el.origin === key) {
          const destinationValue = get(
            this.fields.get(el.destination),
            el.destinationPath.split(".")
          );
          const originValue = get(
            this.fields.get(el.origin),
            el.originParh.split(".")
          );
          if (destinationValue !== originValue) {
            console.log(`need to update ${el.destination} from ${el.origin}`);
            const fieldToUpdate = this.fields.get(el.destination);
            set(fieldToUpdate, el.destinationPath.split("."), originValue);

            console.log("done");
            // fieldToUpdate
            //   .valueSubject$.next({
            //     value: fieldToUpdate.value,
            //     event: "abort",
            //   });
          }
        }
      });
    });
  }

  subscribeTemplates() {
    // const subscribedProps: unknown[] = [];
    this.fields.forEach(
      (
        {
          component,
          props,
          name,
          validations,
          visibilityConditions,
          resetValues,
          errorMessages,
          api,
        },
        key
      ) => {
        const template = {
          component,
          props,
          name,
          validations,
          visibilityConditions,
          resetValues,
          errorMessages,
          api,
        };
        const result = traverseObject(template, key);
        if (result.length > 0) {
          // subscribedProps.push(result);
          this.subscribedTemplates = [...this.subscribedTemplates, ...result];
        }
      }
    );
    // console.log(subscribedProps);
  }

  private static checkIndexes = (
    struct: TSchema,
    indexes: string[] = []
  ): string[] => {
    indexes.push(struct.name);
    if (struct.children) {
      struct.children.forEach((el) => {
        return FormCore.checkIndexes(el, indexes);
      });
    }
    return indexes;
  };

  validateVisibility(event: keyof HTMLElementEventMap, key: string) {
    const field = this.fields.get(key);
    const structVisibility = field?.visibilityConditions?.[event];
    if (!structVisibility) return;
    structVisibility.map((structElement) => {
      Object.keys(structElement.validations).map(
        (validationKey: keyof TValidations) => {
          const error = validations[validationKey](
            field.value,
            structElement.validations
          );

          if (Array.isArray(structElement.fields)) {
            structElement.fields.map((fieldKey) => {
              // this.fields.get(fieldKey).visibilitySubject$.next(error);
              this.fields.get(fieldKey).visibility = error;
            });
          } else if (structElement.fields) {
            this.fields.get(structElement.fields).visibility = error;
            // this.fields
            //   .get(structElement.fields)
            //   .visibilitySubject$.next(error);
          }
        }
      );
    });
  }

  resetValue(event: keyof HTMLElementEventMap, key: string) {
    const field = this.fields.get(key);
    const structResetValue = field?.resetValues?.[event];
    if (!structResetValue) return;
    structResetValue.map((structElement) => {
      Object.keys(structElement.validations).map(
        (validationKey: keyof TValidations) => {
          const error = validations[validationKey](
            field.value,
            structElement.validations
          );
          if (!error) {
            if (Array.isArray(structElement.fields)) {
              structElement.fields.forEach((fieldKey, index: number) => {
                const resettedValue = Array.isArray(
                  structElement.resettedFields
                )
                  ? structElement.resettedFields[index]
                  : structElement.resettedFields;
                this.fields
                  .get(fieldKey)
                  .emitValue({ value: resettedValue, event });
                // this.fields
                //   .get(fieldKey)
                //   .resetValueSubject$.next({ value: resettedValue, event });
              });
            } else if (structElement.fields) {
              this.fields
                .get(structElement.fields)
                .emitValue({ value: structElement.resettedFields, event });
              // this.fields.get(structElement.fields).resetValueSubject$.next({
              //   value: structElement.resettedFields,
              //   event,
              // });
            }
          }
        }
      );
    });
  }

  serializeStructure(struct: TSchema, path?: string): void {
    this.fields.set(
      struct.name,
      new FormField({
        schemaComponent: struct,
        path,
        children: struct.children ? struct.children.map((el) => el.name) : [],
        validateVisibility: this.validateVisibility.bind(this),
        resetValue: this.resetValue.bind(this),
        initialValue: this.initialValues?.[struct.name],
        templateSubject$: this.templateSubject$,
      })
    );
    if (struct.children) {
      struct.children.forEach((el) => {
        return this.serializeStructure(
          el,
          parent ? `${parent}.${struct.name}` : struct.name
        );
      });
    }
  }

  printValues() {
    const values: Record<string, unknown> = {};
    this.fields.forEach((val, key) => {
      if (val.value) {
        values[key] = val.value;
      }
    });
    console.log(values);
  }
}

type TFormCore = FormCore;

export default FormCore;

export { TFormCore };
