import FormField, { IFormField } from './field';
import { validations } from '@/core/validations/validations';
import { traverseObject } from '@/helpers/helpers';
import { debounceTime, Subject } from 'rxjs';
import get from 'lodash/get';
import set from 'lodash/set';
import { ISchema } from '@/interfaces/schema';
import { TValidationMethods } from '@/types/schemaTypes';
import { TSubscribedTemplates } from '@/types/templateTypes';
import { isEqual } from 'lodash';
import { TEvents } from '@/types/eventTypes';

class FormCore {
  schema?: ISchema;
  fields: Map<string, IFormField>;
  initialValues?: Record<string, unknown>;
  templateSubject$: Subject<{ key: string }>;
  subscribedTemplates: TSubscribedTemplates[];
  constructor({
    schema,
    initialValues,
  }: {
    schema?: ISchema;
    initialValues?: Record<string, unknown>;
  }) {
    this.schema = schema;
    this.fields = new Map();
    this.initialValues = initialValues;
    this.schema && FormCore.checkIndexes(this.schema);
    this.templateSubject$ = new Subject();
    this.subscribedTemplates = [];
    this.schema && this.serializeStructure(this.schema);
    this.schema && this.subscribeTemplates();
    this.schema &&
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

  getValue({
    key,
    property,
    path,
  }: {
    key: string;
    property: string;
    path: string[];
  }): unknown | undefined {
    if (!this.fields.has(key))
      return console.warn(`failed to get value from ${key}`);
    return path.length > 0
      ? get(this.fields.get(key)![property as keyof IFormField], path)
      : this.fields.get(key)![property as keyof IFormField];
  }

  setValue({
    key,
    property,
    path,
    value,
  }: {
    key: string;
    property: string;
    path: string[];
    value: unknown;
  }) {
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
      field[property as keyof Omit<IFormField, 'stateValue' | 'errorsString'>] =
        propState as never;
      return;
    }
    field[property as keyof Omit<IFormField, 'stateValue' | 'errorsString'>] =
      value as never;
    return;
  }

  extractParams(expression: string) {
    const regex = /\${(.*?)}/g;
    const extractedValues = [];
    let match;
    while ((match = regex.exec(expression)) !== null) {
      extractedValues.push(match[1]);
    }

    const operatorRegex = /\s*(\|\||&&|!)\s*/g;
    const splittedString = extractedValues.map((el) => el.split(operatorRegex));

    const result = splittedString.map((splittedStringVal) => {
      // console.log(splittedStringVal)
      return splittedStringVal.filter(Boolean).reduce((acc, curr) => {
        if (curr.match(/^\|\||&&|!$/)) {
          return `${acc}${curr}`;
        }
        let value;

        // check if element is in dot notation to get from field instances
        const element = curr.split('.');
        const currElementContent =
          element.length > 1
            ? this.getValue({
                key: element[0],
                property: element[1],
                path: element.slice(2),
              })
            : element;
        let currValue;
        // if any parsable content was passed to the conditions, parse them
        // required to be able to apply conditions
        try {
          currValue = JSON.parse(currElementContent as string);
        } catch (e) {
          currValue = currElementContent;
        }
        switch (typeof currValue) {
          case 'string':
            value = `\`${currValue}\``;
            break;
          case 'boolean':
          case 'undefined':
          case 'number':
            value = currValue;
            break;
          case 'object':
            if (currValue === null) {
              value = null;
            }
            value = JSON.stringify(currValue);
            break;
          default:
            value = currValue;
        }
        return `${acc}${value}`;
      }, '');
    });

    return result.map((el) => {
      try {
        // console.log(el);
        return new Function(`return ${el}`)();
      } catch (e) {
        console.log(e);
        return 'lil error here.. :(';
      }
    });
  }

  replaceExpression(expression: string, values: string[]) {
    const regex = /\${(.*?)}/g;
    // @ts-ignore
    return expression.replace(regex, () => values.shift());
  }

  hasStringConcatenation(expression: string) {
    const regex = /^\${[^${}]*}$/;
    return !regex.test(expression);
  }

  refreshTemplates({ key }: { key: string }) {
    this.subscribedTemplates.forEach(
      ({
        destinationKey,
        destinationPath,
        destinationProperty,
        originExpression,
        originFieldKeys,
      }) => {
        if (originFieldKeys.includes(key)) {
          const originExpressions = this.extractParams(originExpression);
          let originValue;
          if (this.hasStringConcatenation(originExpression)) {
            originValue = this.replaceExpression(originExpression, [
              ...originExpressions,
            ]);
          } else {
            originValue = originExpressions?.[0];
          }

          const destinationValue = this.getValue({
            key: destinationKey,
            property: destinationProperty,
            path: destinationPath,
          });
          if (!isEqual(destinationValue, originValue)) {
            this.setValue({
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

  validateVisibility(event: TEvents, key: string) {
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

  resetValue(event: TEvents, key: string) {
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
    const currField = this.fields.get(struct.name);
    if (!currField) {
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
    } else {
      currField.children =
        struct?.children?.map((el) => el.name) || currField?.children || [];
      currField.path = path;
    }
    if (struct.children) {
      struct.children.forEach((el) => {
        return this.serializeStructure(
          el,
          `${path ? `${path}.` : ``}${struct.name}`
        );
      });
    }
  }

  refreshFields(struct: ISchema) {
    this.serializeStructure(struct);
    const keys = FormCore.checkIndexes(struct);
    this.fields.forEach((_, key) => {
      if (!keys.includes(key)) {
        this.fields.get(key)?.destroyField();
        this.fields.delete(key);
      }
    });
    this.subscribeTemplates();
    // this.templateSubject$.subscribe(this.refreshTemplates.bind(this));
  }

  getField({ key }: { key: string }) {
    return this.fields.get(key);
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
