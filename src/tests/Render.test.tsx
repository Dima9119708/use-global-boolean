import { fireEvent, render } from '@testing-library/react';
import { useEffect } from 'react';

import { generateUniqueName } from './utils/testUtils.ts';

import { useGlobalBoolean, useRegisterBoolean, useWatchBoolean } from '../lib';

let uniqueName: string;

beforeEach(() => {
    uniqueName = generateUniqueName();
});

describe('Boolean State Management in Components', () => {
    test('should update aria-modal attribute of dialog after onTrue is called', () => {
        const Dialog = () => {
            const [open] = useRegisterBoolean(uniqueName);

            return <div role="dialog" aria-modal={open} />;
        };

        const TestComponent = () => {
            const { onTrue } = useGlobalBoolean();

            return (
                <>
                    <button role="button" onClick={() => onTrue(uniqueName)} />
                    <Dialog />
                </>
            );
        };

        const { getByRole } = render(<TestComponent />);

        expect(getByRole('dialog').getAttribute('aria-modal')).toBe('false');

        fireEvent.click(getByRole('button'));

        expect(getByRole('dialog').getAttribute('aria-modal')).toBe('true');
    });
    test('should update dialog content after onTrue is called with data', () => {
        const Dialog = () => {
            const [open, { data }] = useRegisterBoolean<{ title: string; subtitle: string }>(
                uniqueName,
                false,
            );

            return (
                <div role="dialog" aria-modal={open}>
                    {data && (
                        <>
                            <h1 role="heading">{data.title}</h1>
                            <p role="subtitle">{data.subtitle}</p>
                        </>
                    )}
                </div>
            );
        };

        const TestComponent = () => {
            const { onTrue } = useGlobalBoolean();

            return (
                <>
                    <button
                        role="button"
                        onClick={() => onTrue(uniqueName, { title: 'title', subtitle: 'subtitle' })}
                    />
                    <Dialog />
                </>
            );
        };

        const { getByRole, queryByRole } = render(<TestComponent />);

        expect(getByRole('dialog').getAttribute('aria-modal')).toBe('false');

        expect(queryByRole('heading')).toBe(null);
        expect(queryByRole('subtitle')).toBe(null);

        fireEvent.click(getByRole('button'));

        expect(getByRole('dialog').getAttribute('aria-modal')).toBe('true');

        expect(getByRole('heading').textContent).toBe('title');
        expect(getByRole('subtitle').textContent).toBe('subtitle');
    });

    test('should increment render count once when WatchComponent is rendered before RegisterComponent with useWatchBoolean and initial values', () => {
        let countRerenderWatchComponentAsHook = 0;
        let countRerenderWatchComponentAsFunction = 0;

        const WatchComponentAsHook = () => {
            const [, data] = useWatchBoolean(uniqueName, true, { initial: { name: 'test' } });

            useEffect(() => {
                ++countRerenderWatchComponentAsHook;
            }, [data]);

            return null;
        };

        const WatchComponentAsFunction = () => {
            const { watchBoolean } = useGlobalBoolean();

            const [, data] = watchBoolean(uniqueName, true, { initial: { name: 'test' } });

            useEffect(() => {
                ++countRerenderWatchComponentAsFunction;
            }, [data]);

            return null;
        };

        const RegisterComponent = () => {
            useRegisterBoolean(uniqueName, true, { initial: { name: 'test' } });

            return null;
        };

        const TestComponent = () => {
            return (
                <>
                    <WatchComponentAsHook />
                    <WatchComponentAsFunction />
                    <RegisterComponent />
                </>
            );
        };

        render(<TestComponent />);

        expect(countRerenderWatchComponentAsHook).toBe(1);
        expect(countRerenderWatchComponentAsFunction).toBe(1);
    });
    test('should increment render count twice when WatchComponent is rendered before RegisterComponent with useWatchBoolean without initial values', () => {
        let countRerenderWatchComponentAsHook = 0;
        let countRerenderWatchComponentAsFunction = 0;

        const WatchComponentAsHook = () => {
            const result = useWatchBoolean(uniqueName);

            useEffect(() => {
                ++countRerenderWatchComponentAsHook;
            }, [result]);

            return null;
        };

        const WatchComponentAsFunction = () => {
            const { watchBoolean } = useGlobalBoolean();

            const result = watchBoolean(uniqueName);

            useEffect(() => {
                ++countRerenderWatchComponentAsFunction;
            }, [result]);

            return null;
        };

        const RegisterComponent = () => {
            useRegisterBoolean(uniqueName, true, { initial: { name: 'test' } });

            return null;
        };

        const TestComponent = () => {
            return (
                <>
                    <WatchComponentAsHook />
                    <WatchComponentAsFunction />
                    <RegisterComponent />
                </>
            );
        };

        render(<TestComponent />);

        expect(countRerenderWatchComponentAsHook).toBe(2);
        expect(countRerenderWatchComponentAsFunction).toBe(2);
    });
    test('should increment render count once when RegisterComponent is rendered before WatchComponent', () => {
        let countRerenderWatchComponentAsHook = 0;
        let countRerenderWatchComponentAsFunction = 0;

        const WatchComponentAsHook = () => {
            const result = useWatchBoolean(uniqueName);

            useEffect(() => {
                ++countRerenderWatchComponentAsHook;
            }, [result]);

            return null;
        };

        const WatchComponentAsFunction = () => {
            const { watchBoolean } = useGlobalBoolean();

            const result = watchBoolean(uniqueName);

            useEffect(() => {
                ++countRerenderWatchComponentAsFunction;
            }, [result]);

            return null;
        };

        const RegisterComponent = () => {
            useRegisterBoolean(uniqueName, true, { initial: { name: 'test' } });

            return null;
        };

        const TestComponent = () => {
            return (
                <>
                    <RegisterComponent />
                    <WatchComponentAsFunction />
                    <WatchComponentAsHook />
                </>
            );
        };

        render(<TestComponent />);

        expect(countRerenderWatchComponentAsHook).toBe(2);
        expect(countRerenderWatchComponentAsFunction).toBe(2);
    });
});
