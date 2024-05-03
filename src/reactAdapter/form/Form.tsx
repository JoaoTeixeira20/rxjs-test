import { TSchema } from "@/interfaces/schema";
import { FormContextProvider } from "../context/FormContext";
import RenderSchema from "../generators/formBuilder";
import { TMapper } from "@/mappers/mappers";

const Form = ({ schema, mappers }: { schema: TSchema, mappers: TMapper[] }) => {
  return (
    <FormContextProvider schema={schema} mappers={mappers}>
      <RenderSchema></RenderSchema>
    </FormContextProvider>
  );
};

export default Form;
