import { TSchema } from "@/interfaces/schema";
import { observablesList$, validationEvents$ } from "../observables/observables";
import { fromEvent, map } from "rxjs";

const buildHTML = (
  struct: TSchema,
  parent?: HTMLElement,
  origin = document.createElement("div")
) => {
  const newElement = (
    document.querySelector(
      `[data-name="${struct.component}"]`
    ) as HTMLTemplateElement
  ).content.firstElementChild.cloneNode(true) as HTMLElement;
  newElement.querySelector("p").innerText = struct.props.label;
  const elementEvent = newElement.querySelector("input");
  if (elementEvent) {
    observablesList$.push(
      fromEvent(elementEvent, "input").pipe(
        map((event) => ({
          value: (event.currentTarget as HTMLInputElement).value,
          key: (event.currentTarget as HTMLInputElement).dataset.key,
        }))
      )
    );
    elementEvent.dataset.key = struct.name;
  }
  if (struct.validations) {
    Object.keys(struct.validations).forEach(
      (event: keyof HTMLElementEventMap) => {
        validationEvents$.push(
          fromEvent(elementEvent, event).pipe(
            map((event) => ({
              key: (event.currentTarget as HTMLElement).dataset.key,
              type: event.type as keyof HTMLElementEventMap,
            }))
          )
        );
      }
    );
  }
  if (!parent) {
    origin.appendChild(newElement);
  } else {
    parent.appendChild(newElement);
  }

  if (struct.children) {
    struct.children.forEach((el) => {
      return buildHTML(el, newElement, origin);
    });
  }
  return origin;
};

export { buildHTML };
