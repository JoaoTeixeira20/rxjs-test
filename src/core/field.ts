import { validations } from '@/core/validations/validations';
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
import { formatters } from './formatters/formatters';
import isEqual from 'lodash/isEqual';
import {
  TApi,
  TErrorList,
  TErrorMessages,
  TFormatters,
  TResetValues,
  TValidationMethods,
  TValidations,
  TVisibilityContitions,
} from '@/types/schemaTypes';
import { ISchema } from '@/interfaces/schema';
import { IState } from '@/interfaces/state';

class FormField {
  name: string;
  component: string;
  path: string;
  children: string[];
  // config properties
  validations: TValidations;
  visibilityConditions: TVisibilityContitions;
  resetValues: TResetValues;
  errorMessages: TErrorMessages;
  api: TApi;
  formatters: TFormatters[];
  // variable properties
  _props: Record<string, unknown>;
  _value: unknown;
  _stateValue: unknown;
  _visibility: boolean;
  _errors: TErrorList;
  _errorsString: string;
  _apiResponseData: { response: unknown };
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
  validateVisibility: (event: keyof HTMLElementEventMap, key: string) => void;
  resetValue: (event: keyof HTMLElementEventMap, key: string) => void;
  debouncedRequest: (event: keyof HTMLElementEventMap) => Promise<void>;

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
    path: string;
    children: string[];
    validateVisibility: (event: keyof HTMLElementEventMap, key: string) => void;
    resetValue: (event: keyof HTMLElementEventMap, key: string) => void;
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
    this.validateVisibility = validateVisibility;
    this.resetValue = resetValue;
    this.templateSubject$ = templateSubject$;
    this.debouncedRequest = debounce(this.apiRequest, 1000).bind(this);
    this._props = schemaComponent.props;
    this._value = this.formatValue(initialValue || '');
    this._visibility = true;
    this._apiResponseData = { response: this.api?.fallbackValue };
    this._errorsString = '';
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

  set value(value: unknown) {
    if (typeof value === 'undefined' || isEqual(value, this.value)) return;
    if (
      typeof value === 'object' &&
      '_value' in value &&
      '_stateValue' in value
    ) {
      this._value = this.formatValue(value._value);
      this._stateValue = this.formatValue(value._stateValue);
    } else {
      this._value = this.formatValue(value);
      this._stateValue = this.formatValue(value);
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

  set errors(errors: TErrorList) {
    if (typeof errors === 'undefined' || isEqual(errors, this.errors)) return;
    this._errors = errors;
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
  }

  emitValue({
    value,
    event,
  }: {
    value: unknown | { _value: unknown; _stateValue: unknown };
    event: keyof HTMLElementEventMap;
  }): void {
    this.value = value;
    this.validations?.[event] && this.validateField(event);
    this.visibilityConditions?.[event] &&
      this.validateVisibility(event, this.name);
    this.resetValues?.[event] && this.resetValue(event, this.name);
    this.api?.[event] && this.debouncedRequest(event);
  }

  validateField(event: keyof HTMLElementEventMap) {
    const structValidations = this.validations?.[event];
    if (!structValidations) return;
    Object.keys(structValidations).map(
      (validationKey: keyof TValidationMethods) => {
        const error = validations[validationKey](this.value, structValidations);
        if (error) {
          this.errors = {
            ...this.errors,
            [validationKey]: this.errorMessages[validationKey],
          };
        } else {
          const errors = { ...this.errors };
          if (errors) delete errors[validationKey];
          this.errors = errors;
        }
        this.props = {
          ...this.props,
          errorMessages: Object.values(this.errors || []).join(),
        };
        this.propsSubject$.next({
          ...this._props,
          errorMessage: Object.values(this._errors || []).join(),
        });
      }
    );
  }

  formatValue(value: unknown): unknown {
    if (this.formatters) {
      return this.formatters.reduce((acc, curr) => {
        return formatters[curr](acc);
      }, value);
    }
    return value;
  }

  async apiRequest(event: keyof HTMLElementEventMap) {
    const apiRequest = this.api?.[event];
    if (!apiRequest) return;
    try {
      const responseData = await makeRequest(
        apiRequest.method,
        apiRequest.url,
        apiRequest.headers
      );
      const apiResponseData = JSON.parse(String(responseData));
      const response = get(apiResponseData, apiRequest.resultPath);
      this.apiResponseData = { response };
    } catch (e) {
      this.apiResponseData = {
        response:
          typeof this.api.fallbackValue !== 'undefined'
            ? this.api.fallbackValue
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
