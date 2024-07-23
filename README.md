# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

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
