import { useEffect } from 'react';

import { useGlobalBoolean, useRegisterBoolean } from './lib';

const Test = () => {
    const { onTrue } = useGlobalBoolean();

    useEffect(() => {
        onTrue('b');
    }, []);

    return <div>1</div>;
};

const Header = () => {
    const [, { onToggle }] = useRegisterBoolean('b');

    return (
        <h1
            onClick={() => {
                onToggle();
            }}
        >
            App
        </h1>
    );
};

const App = () => {
    return (
        <div>
            <Header />
            <div>AAA</div>
            <Test />
        </div>
    );
};

export default App;
