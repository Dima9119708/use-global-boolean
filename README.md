# useGlobalBoolean

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Dima9119708/use-global-boolean)
[![NPM Version](https://img.shields.io/npm/v/use-global-boolean?style=for-the-badge)](https://www.npmjs.com/package/use-global-boolean)


`useGlobalBoolean` is a hook for managing global boolean variables. 
It can be used to open modals, sidebars, disable elements on a page, 
hide elements, and pass any arguments to the `onTrue` function. 
These arguments are then accessible through the `useRegisterBoolean` hook.

## 🔧 Installation

```sh
# Using yarn.
yarn add use-global-boolean

# Using npm.
npm install use-global-boolean
```

## 🔎 Usage

To use this hook, you'll need `useGlobalBoolean` and `useRegisterBoolean`:

```jsx
// At the top of your file.
import { useGlobalBoolean, useRegisterBoolean } from "use-global-boolean";

// First, register a modal with a unique name.
const WelcomeModal = () => {
    const [opened, { onFalse, onTrue, onToggle, args }] = useRegisterBoolean('modal_welcome');

    return (
        <Dialog opened={opened} onClose={onFalse}>
            { /*.....*/ }
        </Dialog>
    );
}

// Now, trigger our modal from anywhere in the application.
const HeaderMenu = () => {
    const { onTrue } = useGlobalBoolean();

    return (
        <Menu>
            <MenuItem onClick={() => onTrue('modal_welcome')}>Welcome</MenuItem>
            <MenuItem>Logout</MenuItem>
        </Menu>
    );
}

const App = () => {
    return (
        <>
            <header>
                {/* Your project logo */}
                <Logo />

                {/* Some additional links */}
                { items.map((item) => <Link {...item} />) }

                <HeaderMenu />
            </header>

            <WelcomeModal />
        </>
    );
}

export default App
```

## 🫱🏿🫲🏿 Passing arguments

```tsx
import { useGlobalBoolean, useRegisterBoolean } from "use-global-boolean";

const EmailModal = () => {
    // Register the modal with a unique identifier and initial parameters
    const [opened, { args, onFalse }] = useRegisterBoolean('email_modal', false, { email: '' });

    return (
      <Modal opened={opened} onClose={onFalse}>
         <input value={args.email} />
         <button>Send email</button>
      </Modal>
    )
}

const ButtonOpenEmailModal = () => {
    const { onTrue } = useGlobalBoolean();
    
    const onOpenEmailModal = () => {
        // Logic and validation...
        const email = 'hello@world.com';
        onTrue('email_modal', { email })
    };

    // Button to open the email modal, passing parameters
    return <button onClick={onOpenEmailModal}>Open modal</button>
}

const App = () => (
    <>
        <ButtonOpenEmailModal />
        <EmailModal />
    </>
);
```

## [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/) TypeScript 
```tsx
// use-global-boolean.d.ts
import 'use-global-boolean';

declare module "use-global-boolean" {
    interface ListBooleanNames {
        modal1: string;
        modal2: string;
        modal3: string;
    }
}

// Modal.tsx
import { useGlobalBoolean, useRegisterBoolean, useWatchBoolean } from "use-global-boolean";

// Now TypeScript will provide suggestions:
useRegisterBoolean('modal1'); // 'modal1', 'modal2', 'modal3'

const { onTrue, onToggle } = useGlobalBoolean();
onTrue('modal1'); // 'modal1', 'modal2', 'modal3'
onToggle('modal1'); // 'modal1', 'modal2', 'modal3'

useWatchBoolean('modal1'); // 'modal1', 'modal2', 'modal3'
```

