import { Box, Burger, Drawer, Group } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useBooleanController, useGlobalBoolean, useWatchBoolean } from 'use-global-boolean';

import classes from './OpenGlobalDrawerOnBurgerClick.module.css';

const MantineDrawer = () => {
    const [opened, { setFalse }] = useBooleanController('drawer', false);

    return (
        <Drawer
            opened={opened}
            onClose={setFalse}
            padding="md"
            title="Navigation"
            zIndex={1000000}
        ></Drawer>
    );
};

const MantineBurger = () => {
    const { setTrue } = useGlobalBoolean();

    const [opened] = useWatchBoolean('drawer');

    return <Burger opened={opened} onClick={() => setTrue('drawer')} />;
};

export default function OpenGlobalDrawerOnBurgerClick() {
    return (
        <Box pb={10}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <MantineLogo size={30} />

                    <MantineBurger />
                </Group>
            </header>

            <MantineDrawer />
        </Box>
    );
}
