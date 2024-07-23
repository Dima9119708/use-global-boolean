# use-global-boolean

Github: [Click here](https://github.com/Dima9119708/use-global-boolean) 

## Examples

# 1

```tsx
    const Menu = () => {
        const { onTrue } = useGlobalBoolean();

        return (
            <Menu>
                <MenuItem onClick={() => onTrue('modal_welcome')}>Welcome</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
        );
    }

    const WelcomeModal = () => {
        const [opened, { onFalse }] = useRegisterBoolean('modal_welcome');

        return (
            <Dialog opened={opened} onClose={onFalse}>
                { /*.....*/ }
            </Dialog>
        );
    }

    const App = () => {
        return (
            <>
                <header>
                    <Logo />

                    { items.map((item) => <Link {...item} />) }
                    
                    <Menu />
                </header>
                
                <WelcomeModal />
            </>
        );
    }
    
    export default DrawerExample;
```

# 2

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

    const App = () => {
        return (
            <>
                <MantineButton />
                <GlobalDialog />
            </>
        );
    }
    
    export default DrawerExample;
```
