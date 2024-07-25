import ReactDOM from 'react-dom/client';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import Demo from './Demo.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <MantineProvider>
        <Demo />
    </MantineProvider>,
);
