import { TSchema } from "./schema";

type TFormStructure = Map<
  string,
  Omit<TSchema, "name" | "children"> & { parent?: string; value?: unknown }
>;

export { TFormStructure };
