import { Subject } from 'rxjs';
import { TSchema } from './schema';

type TFormStructure = Map<
  string,
  Omit<TSchema | 'children'> & {
    parent?: string;
    // subject?: Subject<unknown>
  }
>;

export { TFormStructure };
