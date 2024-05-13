import FormField, { IFormField } from './field';
import { validations } from '@/core/validations/validations';
import { traverseObject } from '@/helpers/helpers';
import { debounceTime, Subject } from 'rxjs';
import get from 'lodash/get';
import set from 'lodash/set';
import { ISchema } from '@/interfaces/schema';
import { TValidationMethods } from '@/types/schemaTypes';
import { TSubscribedTemplates } from '@/types/templateTypes';

class FormCore {
  schema: ISchema;
  fields: Map<string, IFormField>;
  initialValues?: Record<string, unknown>;
  templateSubject$: Subject<{ key: string }>;
  subscribedTemplates: TSubscribedTemplates[];
  constructor({
    schema,
    initialValues,
  }: {
    schema: ISchema;
    initialValues?: Record<string, unknown>;
  }) {
    this.schema = schema;
    this.fields = new Map();
    this.initialValues = initialValues;
    FormCore.checkIndexes(schema);
    this.templateSubject$ = new Subject();
    this.subscribedTemplates = [];
    this.serializeStructure(this.schema);
    this.subscribeTemplates();
    this.templateSubject$.subscribe(this.refreshTemplates.bind(this));
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
        traverseObject(template, key).forEach((element) =>
          this.subscribedTemplates.push(element)
        );
      }
    );
    // console.log(subscribedProps);
  }

  refreshTemplates({ key }: { key: string }) {
    const getValue = ({
      key,
      property,
      path,
    }: {
      key: string;
      property: string;
      path: string[];
    }): unknown | undefined => {
      if (!this.fields.has(key))
        return console.warn(`failed to get value from ${key}`);
      return path.length > 0
        ? get(this.fields.get(key)![property as keyof IFormField], path)
        : this.fields.get(key)![property as keyof IFormField];
    };

    const setValue = ({
      key,
      property,
      path,
      value,
    }: {
      key: string;
      property: string;
      path: string[];
      value: unknown;
    }) => {
      const field = this.fields.get(key);
      if (!field) {
        console.warn(`failed to update field ${key}`);
        return;
      }
      if (path.length > 0) {
        const propState = {
          ...(field[property as keyof IFormField] as object),
        };
        set(propState, path, value);
        field[
          property as keyof Omit<IFormField, 'stateValue' | 'errorsString'>
        ] = propState as never;
        return;
      }
      field[property as keyof Omit<IFormField, 'stateValue' | 'errorsString'>] =
        value as never;
      return;
    };

    this.subscribedTemplates.forEach(
      ({
        destinationKey,
        destinationPath,
        destinationProperty,
        originKey,
        originPath,
        originProperty,
      }) => {
        if (originKey === key) {
          const destinationValue = getValue({
            key: destinationKey,
            property: destinationProperty,
            path: destinationPath,
          });
          const originValue = getValue({
            key: originKey,
            property: originProperty,
            path: originPath,
          });
          if (destinationValue !== originValue) {
            setValue.bind(this)({
              key: destinationKey,
              property: destinationProperty,
              path: destinationPath,
              value: originValue,
            });
          }
        }
      }
    );
  }

  private static checkIndexes = (
    struct: ISchema,
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
    structVisibility.forEach((structElement) => {
      Object.keys(structElement.validations).forEach(
        (validationKey: keyof TValidationMethods) => {
          const error = validations[validationKey](
            field.value,
            structElement.validations
          );

          if (Array.isArray(structElement.fields)) {
            structElement.fields.forEach((fieldKey) => {
              if (!this.fields.has(fieldKey))
                console.warn(
                  `failed to update visibility onto field ${fieldKey}`
                );
              else this.fields.get(fieldKey)!.visibility = error;
            });
          } else if (structElement.fields) {
            if (!this.fields.has(structElement.fields))
              console.warn(
                `failed to update visibility onto field ${structElement.fields}`
              );
            else this.fields.get(structElement.fields)!.visibility = error;
          }
        }
      );
    });
  }

  resetValue(event: keyof HTMLElementEventMap, key: string) {
    const field = this.fields.get(key);
    const structResetValue = field?.resetValues?.[event];
    if (!structResetValue) return;
    structResetValue.forEach((structElement) => {
      Object.keys(structElement.validations).forEach(
        (validationKey: keyof TValidationMethods) => {
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
                if (!this.fields.has(fieldKey))
                  console.warn(`failed to reset value onto field ${fieldKey}`);
                else
                  this.fields
                    .get(fieldKey)!
                    .emitValue({ value: resettedValue, event });
              });
            } else if (structElement.fields) {
              if (!this.fields.has(structElement.fields))
                console.warn(
                  `failed to reset value onto field ${structElement.fields}`
                );
              else
                this.fields
                  .get(structElement.fields)!
                  .emitValue({ value: structElement.resettedFields, event });
            }
          }
        }
      );
    });
  }

  serializeStructure(struct: ISchema, path?: string): void {
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
          `${path ? `${path}.` : ``}${struct.name}`
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
