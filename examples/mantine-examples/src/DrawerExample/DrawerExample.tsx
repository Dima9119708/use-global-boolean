import { Box, Burger, Drawer, Group, Slider } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useGlobalBoolean, useRegisterBoolean, useWatchBoolean } from 'use-global-boolean';

import classes from './DrawerExample.module.css';

const MantineDrawer = () => {
    const [opened, { onFalse }] = useRegisterBoolean('drawer', false);

    return (
        <Drawer
            opened={opened}
            onClose={onFalse}
            padding="md"
            title="Navigation"
            zIndex={1000000}
        ></Drawer>
    );
};

const MantineBurger = () => {
    const { onTrue } = useGlobalBoolean();

    const opened = useWatchBoolean('drawer');

    return <Burger opened={opened} onClick={() => onTrue('drawer')} />;
};

export default function DrawerExample() {
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
