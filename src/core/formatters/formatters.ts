import { TFormatters, TValidations } from '@/interfaces/schema';

const formatters: Record<TFormatters, (value: unknown) => unknown> = {
  capitalize: (value) => String(value).toUpperCase(),
  dotEvery3chars: (value) => {
    const result = String(value)
      .replace(/\./g, '')
      .replace(/(.{3})/g, '$1.');
    return result.endsWith('.') ? result.slice(0, -1) : result;
  },
  onlyNumbers: (value) => String(value).replace(/[^\d.]/g, ''),
};

export { formatters };
