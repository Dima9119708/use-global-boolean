import { Button, Dialog, Group, Text, TextInput } from '@mantine/core';
import { useGlobalBoolean, useRegisterBoolean } from 'use-global-boolean';

const MantineButton = () => {
    const { onToggle } = useGlobalBoolean();

    return (
        <Button onClick={() => onToggle('dialog', { email: 'hello@gluesticker.com' })}>
            Toggle dialog
        </Button>
    );
};

const MantineDialog = () => {
    const [opened, { onFalse, args }] = useRegisterBoolean('dialog', false, {
        email: '',
    });

    return (
        <Dialog opened={opened} withCloseButton onClose={onFalse} size="lg" radius="md">
            <Text size="sm" mb="xs" fw={500}>
                Subscribe to email newsletter
            </Text>

            <Group align="flex-end">
                <TextInput
                    placeholder="hello@gluesticker.com"
                    value={args.email}
                    onChange={() => {}}
                    style={{ flex: 1 }}
                />
                <Button onClick={close}>Subscribe</Button>
            </Group>
        </Dialog>
    );
};

function DrawerExample() {
    return (
        <>
            <Group justify="center">
                <MantineButton />
            </Group>

            <MantineDialog />
        </>
    );
}

export default DrawerExample;
