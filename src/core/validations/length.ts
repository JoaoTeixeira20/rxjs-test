import { TValidations } from '@/interfaces/schema';

export default (value: unknown, validations: TValidations): boolean => {
  if (!validations.length) return false;

  let targetValue = value;
  // We want length even if it is a numeric
  if (typeof targetValue !== 'string') {
    targetValue = value?.toString();
  }

  const condition: Record<string, boolean> = {
    equal: targetValue.length === validations.length.target,
    notEqual: targetValue.length !== validations.length.target,
    less: targetValue.length < validations.length.target,
    lessOrEqual: targetValue.length <= validations.length.target,
    grater: targetValue.length > validations.length.target,
    greaterOrEqual: targetValue.length >= validations.length.target,
  };

  return condition[validations.length.rule];
};
