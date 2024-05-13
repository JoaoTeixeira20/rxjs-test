export const capitalize = (value: unknown) =>
  String(value).charAt(0).toUpperCase() + String(value).slice(1);

export const uppercase = (value: unknown) => String(value).toUpperCase();
