import { fireEvent, render } from '@testing-library/react';
import { useEffect } from 'react';

import { generateUniqueName } from './utils/testUtils.ts';

import { WatchController, globalBooleanActions, useBooleanController, useGlobalBoolean, useWatchBoolean } from '../lib';
import { forcedCallListener } from '../lib/globalStates/forcedCallListener.ts';

let uniqueName: string;

beforeEach(() => {
    uniqueName = generateUniqueName();
});

describe('Boolean State Management in Components', () => {
    test('should update aria-modal attribute of dialog after onTrue is called', () => {
        const Dialog = () => {
            const [open] = useBooleanController(uniqueName);

            return <div role="dialog" aria-modal={open} />;
        };

        const TestComponent = () => {
            const { setTrue } = useGlobalBoolean();

            return (
                <>
                    <button role="button" onClick={() => setTrue(uniqueName)} />
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
            const [open, { data }] = useBooleanController<{ title: string; subtitle: string }>(uniqueName, false);

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
            const { setTrue } = useGlobalBoolean();

            return (
                <>
                    <button role="button" onClick={() => setTrue(uniqueName, { title: 'title', subtitle: 'subtitle' })} />
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
            useBooleanController(uniqueName, true, { initial: { name: 'test' } });

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
            useBooleanController(uniqueName, true, { initial: { name: 'test' } });

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
            useBooleanController(uniqueName, true, { initial: { name: 'test' } });

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

    test('should keep forcedCallListener size at 0 when useWatchBoolean is rendered before useRegisterBoolean', () => {
        const WatchComponentAsHook = () => {
            useWatchBoolean(uniqueName);
            return null;
        };

        const WatchComponentAsFunction = () => {
            const { watchBoolean } = useGlobalBoolean();
            watchBoolean(uniqueName);
            return null;
        };

        const RegisterComponent = () => {
            useBooleanController(uniqueName, true, { initial: { name: 'test' } });

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

        expect(forcedCallListener.size).toBe(1);
    });
    test('should update forcedCallListener size correctly when WatchComponent is rendered after RegisterComponent with useWatchBoolean without initial values', () => {
        const WatchComponentAsHook = () => {
            useWatchBoolean(uniqueName);
            return null;
        };

        const WatchComponentAsFunction = () => {
            const { watchBoolean } = useGlobalBoolean();
            watchBoolean(uniqueName);
            return null;
        };

        const RegisterComponent = () => {
            useBooleanController(uniqueName, true, { initial: { name: 'test' } });

            return null;
        };

        const TestComponent = () => {
            return (
                <>
                    <RegisterComponent />
                    <WatchComponentAsHook />
                    <WatchComponentAsFunction />
                </>
            );
        };

        const { unmount } = render(<TestComponent />);

        expect(forcedCallListener.size).toBe(1);

        unmount();

        expect(forcedCallListener.size).toBe(0);
    });
    test('should track render counts correctly and update component states based on prop changes and interactions', () => {
        const inputData = 'test';
        let countRender1 = 0;
        let countRender2 = 0;

        const TestComponent = (props: { initialBooleanWatch?: boolean; initialDataWatch?: string }) => {
            const { initialDataWatch, initialBooleanWatch } = props;

            return (
                <>
                    <WatchController>
                        {(props) => {
                            const [show, data] = props.globalMethods.watchBoolean(uniqueName, initialBooleanWatch, initialDataWatch);

                            ++countRender1;

                            return show && <div data-testid="input">{data}</div>;
                        }}
                    </WatchController>

                    <WatchController name={uniqueName}>
                        {(props) => {
                            const [checked, { setTrue, setData }] = props.localState;

                            ++countRender2;

                            return (
                                <div
                                    data-testid="enabled input"
                                    style={{ backgroundColor: checked ? 'green' : 'red' }}
                                    onClick={() => {
                                        setTrue();
                                        setData(inputData);
                                    }}
                                />
                            );
                        }}
                    </WatchController>
                </>
            );
        };

        const { getByTestId, queryByTestId, rerender } = render(<TestComponent initialDataWatch="" initialBooleanWatch={false} />);

        expect(queryByTestId('input')).toBe(null);

        expect(countRender1).toBe(2);
        expect(countRender2).toBe(1);

        fireEvent.click(getByTestId('enabled input'));

        expect(getByTestId('enabled input').style.backgroundColor).toBe('green');

        const $input = getByTestId('input');

        expect($input).toBeInstanceOf(HTMLDivElement);
        expect($input.textContent).toBe(inputData);

        expect(countRender1).toBe(3);
        expect(countRender2).toBe(2);

        countRender1 = 0;
        countRender2 = 0;

        rerender(<TestComponent initialDataWatch={undefined} initialBooleanWatch={false} />);

        expect(countRender1).toBe(1);
        expect(countRender2).toBe(1);

        expect($input.textContent).toBe(inputData);
        expect(getByTestId('enabled input').style.backgroundColor).toBe('green');
    });
    test('should update table row background and open dialog with correct data when edit button is clicked, and close dialog on cancel', () => {
        const dataDialog = { name: 'Anom', age: '19', gender: 'Male' };

        const TestComponent = () => {
            return (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <WatchController key={`table.row`} name={`table.row`}>
                                {(props) => {
                                    const [active, { setTrue }] = props.localState;

                                    return (
                                        <tr
                                            data-testid="table-row"
                                            style={{
                                                backgroundColor: active ? 'red' : 'transparent',
                                            }}
                                        >
                                            <td>Anom</td>
                                            <td>19</td>
                                            <td>Male</td>
                                            <td
                                                data-testid="edit-button"
                                                onClick={() => {
                                                    setTrue();
                                                    props.globalMethods.setTrue('dialog', dataDialog);
                                                }}
                                            >
                                                ✏️
                                            </td>
                                        </tr>
                                    );
                                }}
                            </WatchController>
                        </tbody>
                    </table>

                    <WatchController name="dialog" initialData={{ name: '', age: '', gender: '' }}>
                        {(props) => {
                            const [open, { data, setFalse }] = props.localState;

                            return (
                                <dialog data-testid="dialog" open={open}>
                                    <form data-testid="dialog-form">
                                        <input name="name" value={data.name} readOnly />
                                        <input name="age" value={data.age} readOnly />
                                        <input name="gender" value={data.gender} readOnly />
                                        <button data-testid="cancel-button" type="button" onClick={() => setFalse()}>
                                            Cancel
                                        </button>
                                    </form>
                                </dialog>
                            );
                        }}
                    </WatchController>
                </>
            );
        };

        const { getByTestId } = render(<TestComponent />);

        expect(getByTestId('table-row').style.backgroundColor).toBe('transparent');

        fireEvent.click(getByTestId('edit-button'));

        expect(getByTestId('table-row').style.backgroundColor).toBe('red');

        const $form = getByTestId('dialog-form');

        expect((getByTestId('dialog') as HTMLDialogElement).open).toBe(true);

        expect(($form.children[0] as HTMLInputElement).value).toBe(dataDialog.name);
        expect(($form.children[1] as HTMLInputElement).value).toBe(dataDialog.age);
        expect(($form.children[2] as HTMLInputElement).value).toBe(dataDialog.gender);

        fireEvent.click(getByTestId('cancel-button'));

        expect((getByTestId('dialog') as HTMLDialogElement).open).toBe(false);
    });
    test('render stability should be maintained under multiple state updates in boolean controller', () => {
        let renderCount = 0;

        const TestComponent = () => {
            const [checked, { setTrue, data }] = useBooleanController(uniqueName);

            useEffect(() => {
                ++renderCount;
            }, [checked, data]);

            return (
                <>
                    <button data-testid="button1" onClick={() => setTrue({ test: 'test' })} />
                    <button data-testid="button2" onClick={() => globalBooleanActions.setTrue(uniqueName, { test: 'test' })} />
                </>
            );
        };

        const { getByTestId } = render(<TestComponent />);

        fireEvent.click(getByTestId('button1'));

        expect(renderCount).toBe(2);

        fireEvent.click(getByTestId('button1'));
        fireEvent.click(getByTestId('button1'));
        fireEvent.click(getByTestId('button1'));
        fireEvent.click(getByTestId('button1'));

        expect(renderCount).toBe(2);

        fireEvent.click(getByTestId('button2'));

        expect(renderCount).toBe(2);

        fireEvent.click(getByTestId('button2'));
        fireEvent.click(getByTestId('button2'));
        fireEvent.click(getByTestId('button2'));
        fireEvent.click(getByTestId('button2'));

        expect(renderCount).toBe(2);
    });
    test('component should toggle and display correct data in nested watch controllers when state is toggled', () => {
        const TestComponent = () => {
            return (
                <>
                    <div data-testid="0" onClick={() => globalBooleanActions.toggle('a')}>
                        Show "b" and "c"
                    </div>
                    <WatchController name="a">
                        {(props) => {
                            const [show] = props.localState;

                            return (
                                <>
                                    <WatchController>
                                        {(props) => {
                                            const [, dataB] = props.globalMethods.watchBoolean<number>('b');
                                            const [, dataC] = props.globalMethods.watchBoolean<number>('c');

                                            return (
                                                <>
                                                    <div data-testid="1">{dataB}</div>
                                                    <div data-testid="2">{dataC}</div>
                                                </>
                                            );
                                        }}
                                    </WatchController>

                                    {show && (
                                        <>
                                            <WatchController name="b" initialData="BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB">
                                                {() => null}
                                            </WatchController>
                                            <WatchController name="c" initialData="CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC">
                                                {(props) => {
                                                    const [, data] = props.globalMethods.watchBoolean<number>('b');

                                                    return <div data-testid="3">{data}</div>;
                                                }}
                                            </WatchController>
                                        </>
                                    )}
                                </>
                            );
                        }}
                    </WatchController>
                </>
            );
        };

        const { getByTestId, queryByTestId } = render(<TestComponent />);

        const $1 = getByTestId('1');
        const $2 = getByTestId('2');

        expect($1.innerHTML).toBe('');
        expect($2.innerHTML).toBe('');
        expect(queryByTestId('3')).toBe(null);

        fireEvent.click(getByTestId('0'));

        expect($1.innerHTML).toBe('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
        expect($2.innerHTML).toBe('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
        expect(getByTestId('3').innerHTML).toBe('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');

        fireEvent.click(getByTestId('0'));

        expect($1.innerHTML).toBe('');
        expect($2.innerHTML).toBe('');
        expect(queryByTestId('3')).toBe(null);
    });
});
