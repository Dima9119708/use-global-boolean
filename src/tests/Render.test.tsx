import { cleanup, fireEvent, render } from '@testing-library/react';
import { useEffect } from 'react';

import { generateUniqueName } from './utils/testUtils.ts';

import { useGlobalBoolean, useRegisterBoolean, useWatchBoolean } from '../lib';

afterEach(() => {
    cleanup();
});

const uniqueName = generateUniqueName();

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
        let countRerender = 0;

        const WatchComponent = () => {
            const [, data] = useWatchBoolean(uniqueName, true, { initial: { name: 'test' } });

            useEffect(() => {
                ++countRerender;
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
                    <WatchComponent />
                    <RegisterComponent />
                </>
            );
        };

        render(<TestComponent />);

        expect(countRerender).toBe(1);
    });
    test('should increment render count twice when WatchComponent is rendered before RegisterComponent with useWatchBoolean without initial values', () => {
        let countRerender = 0;

        const WatchComponent = () => {
            const [, data] = useWatchBoolean(uniqueName);

            useEffect(() => {
                ++countRerender;
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
                    <WatchComponent />
                    <RegisterComponent />
                </>
            );
        };

        render(<TestComponent />);

        expect(countRerender).toBe(2);
    });
    test('should increment render count once when RegisterComponent is rendered before WatchComponent', () => {
        let countRerender = 0;

        const WatchComponent = () => {
            const [, data] = useWatchBoolean(uniqueName);

            useEffect(() => {
                ++countRerender;
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
                    <RegisterComponent />
                    <WatchComponent />
                </>
            );
        };

        render(<TestComponent />);

        expect(countRerender).toBe(1);
    });
});
