import { useState } from 'react';

import { TabContext, TabList } from '@mui/lab';
import TabPanel from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';

import CallMenuWithDifferentArgs from './examples/CallMenuWithDifferentArgs/CallMenuWithDifferentArgs.tsx';
import DynamicDisplayOfForms from './examples/DynamicDisplayOfForms/DynamicDisplayOfForms.tsx';

function Demo() {
    const [value, setValue] = useState('1');

    return (
        <TabContext value={value}>
            <TabList
                onChange={(_, newValue) => setValue(newValue)}
                aria-label="lab API tabs example"
                scrollButtons
                allowScrollButtonsMobile
            >
                <Tab label="Dynamic display of forms" value="1" wrapped />
                <Tab label="Displaying a menu with different arguments" value="2" wrapped />
            </TabList>

            <TabPanel value="1">
                <DynamicDisplayOfForms />
            </TabPanel>
            <TabPanel value="2">
                <CallMenuWithDifferentArgs />
            </TabPanel>
        </TabContext>
    );
}

export default Demo;
