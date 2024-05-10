interface IState {
  errors: string[];
  visibility: boolean;
  apiResponse: unknown;
  props: Record<string, unknown>;
}

export { IState };
