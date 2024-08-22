import { Button, Dialog, Group, Text, TextInput } from '@mantine/core';
import { useBooleanController, useGlobalBoolean } from 'use-global-boolean';

const MantineButton = () => {
    const { toggle } = useGlobalBoolean();

    return (
        <Button onClick={() => toggle('dialog', { email: 'hello@gluesticker.com' })}>
            Toggle dialog
        </Button>
    );
};

const MantineDialog = () => {
    const [opened, { setFalse, data }] = useBooleanController('dialog', false, {
        email: '',
    });

    return (
        <Dialog opened={opened} withCloseButton onClose={setFalse} size="lg" radius="md">
            <Text size="sm" mb="xs" fw={500}>
                Subscribe to email newsletter
            </Text>

            <Group align="flex-end">
                <TextInput
                    placeholder="hello@gluesticker.com"
                    value={data.email}
                    onChange={() => {}}
                    style={{ flex: 1 }}
                />
                <Button onClick={close}>Subscribe</Button>
            </Group>
        </Dialog>
    );
};

function CallingDialogWithArgument() {
    return (
        <>
            <Group justify="center">
                <MantineButton />
            </Group>

            <MantineDialog />
        </>
    );
}

export default CallingDialogWithArgument;
