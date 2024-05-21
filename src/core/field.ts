import {
  combineLatest,
  debounceTime,
  Observable,
  startWith,
  Subject,
  map,
  Subscription,
} from 'rxjs';
import { makeRequest } from '@/helpers/helpers';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import {
  TApi,
  TApiConfig,
  TErrorList,
  TErrorMessages,
  TFormatters,
  TMasks,
  TResetValues,
  TValidationMethods,
  TValidations,
  TVisibilityContitions,
} from '@/types/schemaTypes';
import { ISchema } from '@/interfaces/schema';
import { IState } from '@/interfaces/state';
import { TEvents } from '@/types/eventTypes';
import { formatters } from '@/core/formatters/handler';
import { masks } from '@/core/masks/handler';
import { validations } from '@/core/validations/handler';

class FormField {
  name: string;
  component: string;
  path?: string;
  children: string[];
  // config properties
  validations?: TValidations;
  visibilityConditions?: TVisibilityContitions;
  resetValues?: TResetValues;
  errorMessages?: TErrorMessages;
  api?: TApi;
  formatters?: TFormatters;
  masks?: TMasks;
  // variable properties
  _props: Record<string, unknown>;
  _value: unknown;
  _stateValue: unknown;
  _visibility: boolean;
  _errors: TErrorList;
  _errorsString: string;
  _apiResponseData: { response: unknown };
  _valid: boolean;
  // subjects/observables
  propsSubject$: Subject<Record<string, unknown>>;
  errorSubject$: Subject<string[]>;
  valueSubject$: Subject<unknown>;
  visibilitySubject$: Subject<boolean>;
  apiSubject$: Subject<{ response: unknown }>;
  fieldState$: Observable<IState>;
  fieldStateSubscription$: Subscription;
  templateSubject$: Subject<{ key: string }>;
  // form state handlers
  validateVisibility: (event: TEvents, key: string) => void;
  resetValue: (event: TEvents, key: string) => void;
  debouncedRequest: (config: TApiConfig) => Promise<void>;

  constructor({
    schemaComponent,
    path,
    children,
    validateVisibility,
    resetValue,
    initialValue,
    templateSubject$,
  }: {
    schemaComponent: ISchema;
    path?: string;
    children: string[];
    validateVisibility: (event: TEvents, key: string) => void;
    resetValue: (event: TEvents, key: string) => void;
    initialValue?: unknown;
    templateSubject$: Subject<{ key: string }>;
  }) {
    this.name = schemaComponent.name;
    this.component = schemaComponent.component;
    this.path = path;
    this.children = children;
    this.validations = schemaComponent.validations;
    this.errorMessages = schemaComponent.errorMessages;
    this.visibilityConditions = schemaComponent.visibilityConditions;
    this.resetValues = schemaComponent.resetValues;
    this.api = schemaComponent.api;
    this.formatters = schemaComponent.formatters;
    this.masks = schemaComponent.masks;
    this.validateVisibility = validateVisibility;
    this.resetValue = resetValue;
    this.templateSubject$ = templateSubject$;
    this.debouncedRequest = debounce(this.apiRequest, 1000).bind(this);
    this._props = schemaComponent.props;
    this._value = this.formatValue(initialValue || '');
    this._stateValue = this.maskValue(this.formatValue(initialValue || ''));
    this._visibility = true;
    this._apiResponseData = { response: this.api?.config?.fallbackValue || '' };
    this._errorsString = '';
    this._valid = false;
    this.valueSubject$ = new Subject();
    this.errorSubject$ = new Subject();
    this.visibilitySubject$ = new Subject();
    this.apiSubject$ = new Subject();
    this.propsSubject$ = new Subject();
    this.fieldState$ = new Subject();
  }

  get props() {
    return this._props;
  }

  set props(props: Record<string, unknown>) {
    if (typeof props === 'undefined' || isEqual(props, this.props)) return;
    this._props = props;
    this.propsSubject$.next(this.props);
    this.templateSubject$.next({ key: this.name });
  }

  get stateValue() {
    return this._stateValue;
  }

  get value() {
    return this._value;
  }

  get errorsString() {
    return this._errorsString;
  }

  set value(value: unknown) {
    if (
      typeof value === 'undefined' ||
      value === null ||
      isEqual(value, this.value)
    )
      return;
    if (
      typeof value === 'object' &&
      '_value' in value &&
      '_stateValue' in value
    ) {
      this._value = this.formatValue(value._value);
      this._stateValue = this.maskValue(this.formatValue(value._stateValue));
    } else {
      this._value = this.formatValue(value);
      this._stateValue = this.maskValue(this.formatValue(value));
    }
    // this._value = this.formatValue(value);
    this.valueSubject$.next(this._stateValue);
    this.templateSubject$.next({ key: this.name });
  }

  get visibility() {
    return this._visibility;
  }

  set visibility(visible: boolean) {
    if (typeof visible === 'undefined' || visible === this.visibility) return;
    this._visibility = visible;
    this.visibilitySubject$.next(this.visibility);
    this.templateSubject$.next({ key: this.name });
  }

  get errors() {
    return this._errors;
  }

  get valid() {
    return this._valid;
  }

  set errors(errors: TErrorList) {
    if (typeof errors === 'undefined' || isEqual(errors, this.errors)) return;
    this._errors = errors;
    this._errorsString = Object.values(this.errors).join(', ');
    this.errorSubject$.next(Object.values(this.errors));
    this.templateSubject$.next({ key: this.name });
  }

  get apiResponseData() {
    return this._apiResponseData;
  }

  set apiResponseData(response) {
    if (
      typeof response === 'undefined' ||
      isEqual(response, this.apiResponseData)
    )
      return;
    this._apiResponseData = response;
    this.apiSubject$.next(this.apiResponseData);
    this.templateSubject$.next({ key: this.name });
  }

  mountField() {
    if (!this.valueSubject$ || this.valueSubject$.closed) {
      this.valueSubject$ = new Subject();
    }
    if (!this.errorSubject$ || this.errorSubject$.closed) {
      this.errorSubject$ = new Subject();
    }
    if (!this.visibilitySubject$ || this.visibilitySubject$.closed) {
      this.visibilitySubject$ = new Subject();
    }
    if (!this.apiSubject$ || this.apiSubject$.closed) {
      this.apiSubject$ = new Subject();
    }

    if (!this.propsSubject$ || this.propsSubject$.closed) {
      this.propsSubject$ = new Subject();
    }

    // templateSubject$ needs to be emmited before the state declaration
    // due to startWith operator on fieldState$ Subjects resets the value
    // emmitted
    this.templateSubject$.next({ key: this.name });

    this.fieldState$ = combineLatest({
      errors: this.errorSubject$.pipe(startWith([])),
      visibility: this.visibilitySubject$.pipe(startWith(true)),
      apiResponse: this.apiSubject$.pipe(
        startWith(this._apiResponseData),
        map(({ response }) => response)
      ),
      props: this.propsSubject$.pipe(startWith(this._props)),
    });

    this.emitEvents({ event: 'ON_FIELD_MOUNT' });
  }

  emitValue({
    value,
    event,
  }: {
    value: unknown | { _value: unknown; _stateValue: unknown };
    event: TEvents;
  }): void {
    this.value = value;
    this.emitEvents({ event });
  }

  emitEvents({ event }: { event: TEvents }): void {
    this.setFieldValidity({ event });
    this.visibilityConditions?.[event] &&
      this.validateVisibility(event, this.name);
    this.resetValues?.[event] && this.resetValue(event, this.name);
    this.api?.events?.includes(event) &&
      this.api?.config &&
      this.debouncedRequest(this.api?.config);
  }

  setFieldValidity({ event }: { event: TEvents }): void {
    if (!this.validations) {
      this._valid = true;
      return;
    }
    let valid = true;
    let errors = { ...this.errors };
    Object.keys(this.validations).forEach((schemaEvent: TEvents) => {
      const schemaValidations = this.validations?.[schemaEvent];
      schemaValidations &&
        Object.keys(schemaValidations).forEach(
          (validationKey: keyof TValidationMethods) => {
            const error = validations[validationKey](
              this.value,
              this.validations?.[schemaEvent] as TValidationMethods
            );
            // setting valid flag
            valid = !error && valid;
            // setting error messages
            if (event === schemaEvent || event === 'ON_FORM_SUBMIT') {
              if (error && this.errorMessages?.[validationKey]) {
                errors[validationKey] = this.errorMessages[validationKey];
              } else {
                delete errors[validationKey];
              }
            }
          }
        );
    });
    this._valid = valid;
    this.errors = errors;
    // remove later
    this.props = {
      ...this.props,
      errorMessage: this.errorsString,
    };
    this.propsSubject$.next({
      ...this._props,
      errorMessage: this.errorsString,
    });
  }

  formatValue(value: unknown): unknown {
    if (this.formatters) {
      return Object.keys(this.formatters).reduce(
        (acc, curr: keyof TFormatters) => {
          return formatters[curr](acc, this.formatters);
        },
        value
      );
    }
    return value;
  }

  maskValue(value: unknown): unknown {
    if (this.masks) {
      return Object.keys(this.masks).reduce((acc, curr: keyof TMasks) => {
        return masks[curr](acc, this.masks);
      }, value);
    }
    return value;
  }

  async apiRequest(config: TApiConfig) {
    if (!config) return;
    try {
      const responseData = await makeRequest(
        config.method,
        config.url,
        config.headers
      );
      const apiResponseData = JSON.parse(String(responseData));
      const response = get(apiResponseData, config.resultPath || '');
      this.apiResponseData = { response };
    } catch (e) {
      this.apiResponseData = {
        response:
          typeof config?.fallbackValue !== 'undefined'
            ? config.fallbackValue
            : 'error',
      };
    }
    // this._apiResponseData = { response };
    // this.apiSubject$.next({ response });
  }

  destroyField() {
    this.errorSubject$.unsubscribe();
    this.valueSubject$.unsubscribe();
    this.visibilitySubject$.unsubscribe();
    this.apiSubject$.unsubscribe();
    this.fieldStateSubscription$.unsubscribe();
  }

  subscribeState(
    callback: (payload: {
      errors: string[];
      visibility: boolean;
      apiResponse: unknown;
      props: Record<string, unknown>;
    }) => void
  ) {
    this.fieldStateSubscription$ = this.fieldState$
      .pipe(debounceTime(100))
      .subscribe({
        next: callback,
      });
  }

  subscribeValue(callback: (value: unknown) => void) {
    this.valueSubject$.subscribe({
      next: callback,
    });
  }
}

export default FormField;

type IFormField = FormField;

export { IFormField };
