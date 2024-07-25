import ReactDOM from 'react-dom/client';

import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Demo from './Demo.tsx';

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Demo />
    </ThemeProvider>,
);
