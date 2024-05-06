import { TValidations } from "@/interfaces/schema";

const validations: Record<
  keyof TValidations,
  (value: unknown, validations: TValidations) => boolean
> = {
  max: (value, validations) => {
    return Number(value) > Number(validations.max);
  },
  min: (value, validations) => {
    return Number(value) < Number(validations.min);
  },
  required: (value, validations) => {
    return (
      validations.required &&
      (!value || (typeof value === "string" && value.length === 0))
    );
  },
};

export { validations };
