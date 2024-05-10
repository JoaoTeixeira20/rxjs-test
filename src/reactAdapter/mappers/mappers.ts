import Container from '@/reactAdapter/components/Container/Container';
import InputElement from '@/reactAdapter/components/InputElement/InputElement';
import { Input } from '@bolttech/atoms-input';
import { DatePicker } from '@bolttech/molecules-date-picker';
import { Dropdown } from '@bolttech/molecules-dropdown';
import { ElementType } from 'react';

type TMapper = {
  component: ElementType;
  componentName: string;
  valueChangeEvent?: (
    event: unknown
  ) => unknown | { _value: unknown; _stateValue: unknown };
};

const mappers: TMapper[] = [
  {
    component: InputElement,
    componentName: 'input',
  },
  {
    component: Container,
    componentName: 'div',
  },
  {
    component: Input,
    componentName: 'libinput',
  },
  {
    component: Dropdown,
    componentName: 'dropdown',
    valueChangeEvent: (event: {
      id: string;
      label: string;
      value: string;
    }) => ({ _value: event.value, _stateValue: event.id }),
  },
  {
    component: DatePicker,
    componentName: 'datepicker',
    valueChangeEvent: (event: string) => event,
  },
];

export { mappers, TMapper };
