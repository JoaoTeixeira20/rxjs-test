import { TFormCore } from './form';

class FormGroup {
  forms: Map<string, TFormCore>;
  constructor() {
    this.forms = new Map();
  }

  addForm({ key, formInstance }: { key: string; formInstance: TFormCore }) {
    this.checkIndexes({ key });
    this.forms.set(key, formInstance);
  }

  getForm({ key }: { key: string }) {
    return this.forms.get(key);
  }

  removeForm({ key }: { key: string }) {
    //@TODO logic to unsubscribe all form related
    this.forms.delete(key);
  }

  checkIndexes({ key }: { key: string }) {
    if (this.forms.has(key)) {
      throw new Error(`duplicate index ${key} on form group`);
    }
  }

  printFormGroupInstance() {
    console.log(this.forms);
  }
}

type TFormGroup = FormGroup;

export default FormGroup;

export { TFormGroup };
