import FormField, { IFormField } from './field';
import { validations } from '@/core/validations/handler';
import { traverseObject } from '@/helpers/helpers';
import { Subject } from 'rxjs';
import get from 'lodash/get';
import set from 'lodash/set';
import { IComponentSchema, IFormSchema } from '@/interfaces/schema';
import { TValidationMethods } from '@/types/schemaTypes';
import { TSubscribedTemplates } from '@/types/templateTypes';
import { isEqual } from 'lodash';
import { TEvents } from '@/types/eventTypes';

class FormCore {
  schema?: IFormSchema;
  fields: Map<string, IFormField>;
  initialValues?: Record<string, unknown>;
  templateSubject$: Subject<{ key: string }>;
  subscribedTemplates: TSubscribedTemplates[];
  action?: string;
  method?: string;
  constructor({
    schema,
    initialValues,
    action,
    method,
  }: {
    schema?: IFormSchema;
  } & Omit<IFormSchema, 'components'>) {
    this.schema = schema;
    this.fields = new Map();
    this.initialValues = initialValues || schema?.initialValues;
    this.action = action || schema?.action;
    this.method = method || schema?.method;
    this.schema && FormCore.checkIndexes(this.schema.components);
    this.templateSubject$ = new Subject();
    this.subscribedTemplates = [];
    this.schema && this.serializeStructure(this.schema.components);
    this.schema && this.subscribeTemplates();
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
    struct?: IComponentSchema[],
    indexes: string[] = []
  ): string[] => {
    if (!struct) return indexes;
    struct.forEach((structElement) => {
      indexes.push(structElement.name);
      if (structElement.children) {
        return FormCore.checkIndexes(structElement.children, indexes);
      }
    });
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

  serializeStructure(struct?: IComponentSchema[], path?: string): void {
    if (!struct) return;
    struct.forEach((structElement) => {
      const currField = this.fields.get(structElement.name);
      if (!currField) {
        this.fields.set(
          structElement.name,
          new FormField({
            schemaComponent: structElement,
            path,
            children: structElement.children
              ? structElement.children.map((el) => el.name)
              : [],
            validateVisibility: this.validateVisibility.bind(this),
            resetValue: this.resetValue.bind(this),
            initialValue: this.initialValues?.[structElement.name],
            templateSubject$: this.templateSubject$,
          })
        );
      } else {
        currField.children =
          structElement?.children?.map((el) => el.name) ||
          currField?.children ||
          [];
        currField.path = path;
        currField.templateSubject$ = this.templateSubject$;
      }
      if (structElement.children) {
        return this.serializeStructure(
          structElement.children,
          `${path ? `${path}.` : ``}${structElement.name}`
        );
      }
    });
  }

  refreshFields(struct: IComponentSchema[]) {
    this.serializeStructure(struct);
    const keys = FormCore.checkIndexes(struct);
    this.fields.forEach((_, key) => {
      if (!keys.includes(key)) {
        this.fields.get(key)?.destroyField();
        this.fields.delete(key);
      }
    });
    this.subscribeTemplates();
    //@TODO bruteforce way, need to optimize
    this.subscribedTemplates.forEach((el) => {
      el.originFieldKeys.forEach((field) => {
        this.templateSubject$.next({ key: field });
      });
    });
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
