# use-global-boolean

## Examples

```tsx
    const Button = () => {
        const { onToggle } = useGlobalBoolean();
    
        return (
            <button onClick={() => onToggle('dialog', { email: 'hello@test.com' })}>
                Toggle dialog
            </button>
        );
    };
    
    const GlobalModal = () => {
        const [opened, { onFalse, args }] = useRegisterBoolean('dialog', false, { email: '' });
    
        return (
            <Dialog opened={opened} onClose={onFalse}>
                <TextInput value={args.email} />
            </Dialog>
        );
    };

    const DrawerExample = () => {
        return (
            <>
                <MantineButton />
                <GlobalDialog />
            </>
        );
    }
    
    export default DrawerExample;
```
