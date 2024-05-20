import ReactDOM from 'react-dom/client';
import { schema } from '@/constants/schema';
import Form from './form/Form';
import { mappers } from '@/reactAdapter/mappers/mappers';
import { BolttechThemeProvider } from '@bolttech/frontend-foundations';
import { bolttechTheme } from '@bolttech/default-theme';
import { FormGroupContextProvider } from './context/FormGroupContext';
import FormTestComponent from './FormTestComponent/FormTestComponent';

const App = () => (
  <>
    <BolttechThemeProvider theme={bolttechTheme}>
      <FormGroupContextProvider mappers={mappers}>
        <FormTestComponent/>
      </FormGroupContextProvider>
    </BolttechThemeProvider>
  </>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') || document.createElement('div')
);
root.render(<App />);
