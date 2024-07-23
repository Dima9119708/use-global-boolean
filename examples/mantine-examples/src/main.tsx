import ReactDOM from 'react-dom/client';

import { Divider, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import DialogExample from './DialogExample/DialogExample.tsx';
import DrawerExample from './DrawerExample/DrawerExample.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <MantineProvider>
        <DrawerExample />
        <Divider my={30} />
        <DialogExample />
        <Divider my={30} />
    </MantineProvider>,
);
