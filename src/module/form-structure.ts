import { TSchema } from "@/interfaces/schema";
import { TFormStructure } from "@/interfaces/structure";

const serializeStructure = (
  struct: TSchema,
  map: TFormStructure = new Map(),
  parent?: string
): TFormStructure => {
  map.set(struct.name, {
    parent,
    component: struct.component,
    validations: struct.validations,
    props: {
      label: struct.props.label,
    },
  });
  if (struct.children) {
    struct.children.forEach((el) => {
      return serializeStructure(el, map, struct.name);
    });
  }
  return map;
};

const checkIndexes = (struct: TSchema, indexes: string[] = []): string[] => {
  indexes.push(struct.name);
  if (struct.children) {
    struct.children.forEach((el) => {
      return checkIndexes(el, indexes);
    });
  }
  return indexes;
};

export { serializeStructure, checkIndexes };
