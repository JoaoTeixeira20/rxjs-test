import ReactDOM from "react-dom/client";
import { schema } from "@/constants/schema";
import Form from "./form/Form";
import { mappers } from "@/mappers/mappers";
import { BolttechThemeProvider } from "@bolttech/frontend-foundations";
import { bolttechTheme } from '@bolttech/default-theme'

const App = () => (
  <>
  <BolttechThemeProvider theme={bolttechTheme}>
    <Form schema={schema} mappers={mappers} initialValues={{name: 'foo'}}/>
    </BolttechThemeProvider>
  </>
);

const root = ReactDOM.createRoot(
  document.getElementById("root") || document.createElement("div")
);
root.render(<App />);
