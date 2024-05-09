import ReactDOM from "react-dom/client";
import { schema } from "@/constants/schema";
import Form from "./form/Form";
import { mappers } from "@/reactAdapter/mappers/mappers";
import { BolttechThemeProvider } from "@bolttech/frontend-foundations";
import { bolttechTheme } from "@bolttech/default-theme";

const App = () => (
  <>
    <BolttechThemeProvider theme={bolttechTheme}>
      <Form
        schema={schema}
        mappers={mappers}
        initialValues={{ name: "foo", bal: "bal", baz: "baz" }}
      />
    </BolttechThemeProvider>
  </>
);

const root = ReactDOM.createRoot(
  document.getElementById("root") || document.createElement("div")
);
root.render(<App />);
