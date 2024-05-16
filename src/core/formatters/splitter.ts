import { TFormatters } from '@/types/schemaTypes';

export const undo_splitter = (
  value: unknown,
  formatters: TFormatters
): unknown => {
  if (!value || !formatters.undo_splitter || typeof value !== 'string')
    return value;

  let originalValue = '';
  let formattersApplied = 0;
  formatters.undo_splitter.forEach((formatter, i) => {
    const nextStartingIndex =
      i === 0 ? i : (formatters.undo_splitter?.at(i - 1)?.position || 0) + 1;
    if (value[formatter.position] == formatter.value) {
      formattersApplied++;
    }
    originalValue += value.slice(nextStartingIndex, formatter.position);
  });
  originalValue += value.slice(originalValue.length + formattersApplied);

  return originalValue;
};

export const splitter = (value: unknown, formatters: TFormatters): unknown => {
  if (!value || !formatters.splitter || typeof value !== 'string') return value;

  let formattedValue = <string>undo_splitter(value, {
    undo_splitter: formatters.splitter,
  });
  formatters.splitter.forEach(
    (formatter: { position: number; value: unknown }): void => {
      if (formatter.position >= value.length) {
        return;
      }

      formattedValue =
        formattedValue.slice(0, formatter.position) +
        formatter.value +
        formattedValue.slice(formatter.position, formattedValue?.length);
    }
  );
  return formattedValue;
};
