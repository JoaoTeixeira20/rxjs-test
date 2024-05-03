import { fromEvent } from "rxjs";
import { schema } from "./constants/schema";
import { checkIndexes, serializeStructure } from "./module/form-structure";
import { mergeObservables, mergeValidations } from "./observables/observables";
// import { buildHTML } from "./adapters/dom-render";
import FormCore from "./core/form";

const submitButton = document.createElement("button");
submitButton.textContent = "submit";

const submitObservable = fromEvent<MouseEvent>(submitButton, "click");

submitObservable.subscribe(() => {
  const result: Record<string, unknown> = {};
  structure.forEach((value, key) => {
    // if (value.value) result[key] = value.value;
  });
  console.log(result);
});

console.log(checkIndexes(schema));
const structure = serializeStructure(schema);
console.log(structure);
// const htmlBuild = buildHTML(schema);

const mergedObservables = mergeObservables(structure);
const mergedValidations = mergeValidations(structure);

console.log(mergedObservables);
console.log(mergedValidations);

// document.body.appendChild(htmlBuild);
document.body.appendChild(submitButton);

// const FormInstance = new FormCore(schema);

// console.log("form instance");
// console.log(FormInstance.fields);
