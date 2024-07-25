import { useEffect } from 'react';

import { useGlobalBoolean, useRegisterBoolean, useWatchBoolean } from './lib';

const Test = () => {
    const { onToggle } = useGlobalBoolean();

    const [isTest] = useWatchBoolean<{ test: boolean }>('test');

    useEffect(() => {}, [isTest]);

    return <div onClick={() => onToggle('test')}>1</div>;
};

const Header = () => {
    const [show, { onToggle }] = useRegisterBoolean('test');

    return (
        show && (
            <h1
                onClick={() => {
                    onToggle();
                }}
            >
                App
            </h1>
        )
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
