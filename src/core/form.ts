import { TSchema, TValidations } from "@/interfaces/schema";
import FormField, { IFormField } from "./field";
import { validations } from "@/validations/validations";

class FormCore {
  schema: TSchema;
  fields: Map<string, IFormField>;
  constructor(schema: TSchema) {
    this.schema = schema;
    this.fields = new Map();
    const indexes = FormCore.checkIndexes(schema);
    if (indexes.length > new Set(indexes).size)
      throw new Error("duplicate indexes while generating the schema");
    this.initializeStructure();
  }

  initializeStructure() {
    this.serializeStructure(this.schema);
  }

  destroyFields(key: string) {
    this.fields.get(key).destroyField();
    this.fields.delete(key);
    this.fields.forEach((el, key) => {
      if (el.parent === key) {
        this.destroyFields(key);
      }
    });
  }

  rebuildFields(key: string) {
    this.serializeStructure(this.schema, key);
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
              this.fields.get(fieldKey).visibilitySubject.next(error);
            });
          } else if (structElement.fields) {
            this.fields.get(structElement.fields).visibilitySubject.next(error);
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
                  .resetValueSubject.next({ value: resettedValue, event });
              });
            } else if (structElement.fields) {
              this.fields
                .get(structElement.fields)
                .resetValueSubject.next({
                  value: structElement.resettedFields,
                  event,
                });
            }
          }
        }
      );
    });
  }

  serializeStructure(struct: TSchema, name?: string, parent?: string): void {
    if (name === struct.name || !name) {
      this.fields.set(struct.name, new FormField(struct, parent, this));
    }
    if (struct.children) {
      struct.children.forEach((el) => {
        return this.serializeStructure(
          el,
          name === el.name ? null : name,
          struct.name
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
