import Container from '@/reactAdapter/components/Container/Container';
import InputElement from '@/reactAdapter/components/InputElement/InputElement';
import { TEvents } from '@/types/eventTypes';
import { Input } from '@bolttech/atoms-input';
import { DatePicker } from '@bolttech/molecules-date-picker';
import { Dropdown } from '@bolttech/molecules-dropdown';
import { ElementType } from 'react';

type TComponentPropsMapping = {
  getValue?: string;
  setValue?: string;
  onBlur?: string;
  onClick?: string;
  onFocus?: string;
  onKeyUp?: string;
  onKeyDown?: string;
  setErrorMessage?: string;
  setErrorState?: string;
};

type TMapper = {
  component: ElementType;
  componentName: string;
  events?: TComponentPropsMapping
  valueChangeEvent?: (
    event: unknown
  ) => unknown | { _value: unknown; _stateValue: unknown };
};

const mappers: TMapper[] = [
  {
    component: InputElement,
    componentName: 'input',
    events: {
      getValue: 'onChange2',
      onBlur: 'onBlur2',
      onFocus: 'onFocus2',
    }
  },
  {
    component: Container,
    componentName: 'div',
  },
  {
    component: Input,
    componentName: 'libinput',
    events: {
      getValue: 'onChange',
      onBlur: 'onBlur',
    }
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
