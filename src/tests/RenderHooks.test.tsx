import { act, cleanup, renderHook } from '@testing-library/react';

import { generateUniqueName } from './utils/testUtils.ts';

import { useGlobalBoolean, useRegisterBoolean, useWatchBoolean } from '../lib';
import { errorMessages } from '../lib/errorMessages.ts';
import { booleanStateListeners } from '../lib/globalStates/booleanStateListeners';
import { booleanStateManager } from '../lib/globalStates/booleanStateManager';

afterEach(() => {
    cleanup();
});

const name = generateUniqueName();

describe('booleanStateManager', () => {
    test('should remove the state from booleanStateManager after unmount', () => {
        const name = generateUniqueName();

        const { unmount } = renderHook(() => useRegisterBoolean(name));

        unmount();

        expect(booleanStateManager.get(name)).toBe(undefined);
    });
});

describe('useRegisterBoolean', () => {
    test('Should check the default state values', () => {
        const { result } = renderHook(() => useRegisterBoolean(name));

        expect(result.current).toEqual([
            false,
            {
                onTrue: result.current[1].onTrue,
                onFalse: result.current[1].onFalse,
                onToggle: result.current[1].onToggle,
                setData: result.current[1].setData,
                data: null,
            },
        ]);
    });
    test('Should check initial state with initialBoolean = true and default parameters', () => {
        const initialData = { test: 'test' };

        const { result } = renderHook(() => useRegisterBoolean(name, true, initialData));

        expect(result.current).toEqual([
            true,
            {
                onTrue: result.current[1].onTrue,
                onFalse: result.current[1].onFalse,
                onToggle: result.current[1].onToggle,
                setData: result.current[1].setData,
                data: initialData,
            },
        ]);
    });
    test('Should change state from false to true using the onTrue method', () => {
        const { result } = renderHook(() => useRegisterBoolean(name));

        act(() => {
            result.current[1].onTrue();
        });

        expect(result.current[0]).toEqual(true);
    });
    test('Should change state from true to false using the onToggle method', () => {
        const { result } = renderHook(() => useRegisterBoolean(name, true));

        act(() => {
            result.current[1].onToggle();
        });

        expect(result.current[0]).toEqual(false);
    });
    test('Should change state from true to false using the onFalse method', () => {
        const { result } = renderHook(() => useRegisterBoolean(name, true));

        act(() => {
            result.current[1].onToggle();
        });

        expect(result.current[0]).toEqual(false);
    });
    test('Should toggle state between true and false', () => {
        const { result } = renderHook(() => useRegisterBoolean(name, true));

        act(() => {
            result.current[1].onToggle();
        });

        expect(result.current[0]).toEqual(false);

        act(() => {
            result.current[1].onToggle();
        });

        expect(result.current[0]).toEqual(true);
    });
    test('should log an error when registering the same boolean name multiple times', () => {
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

        renderHook(() => useRegisterBoolean(name));
        renderHook(() => useRegisterBoolean(name));

        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining(errorMessages.alreadyRegisteredName(name)),
        );

        consoleErrorMock.mockRestore();
    });
});

describe('useGlobalBoolean', () => {
    test('Should set boolean to true using onTrue method', () => {
        const registerBoolean = renderHook(() => useRegisterBoolean(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onTrue(name);
        });

        expect(registerBoolean.result.current[0]).toEqual(true);
    });
    test('Should toggle boolean state to true using onToggle method', () => {
        const registerBoolean = renderHook(() => useRegisterBoolean(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onToggle(name);
        });

        expect(registerBoolean.result.current[0]).toEqual(true);
    });
    test('Should set boolean to false using onFalse method when initial value is true', () => {
        const registerBoolean = renderHook(() => useRegisterBoolean(name, true));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onFalse(name);
        });

        expect(registerBoolean.result.current[0]).toEqual(false);
    });
    test('Should set boolean to true and update data using onTrue method', () => {
        const registerBoolean = renderHook(() => useRegisterBoolean(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onTrue(name, { test: 'test' });
        });

        expect(registerBoolean.result.current[0]).toEqual(true);
        expect(registerBoolean.result.current[1].data).toEqual({ test: 'test' });
    });
    test('Should toggle boolean state to true and update data using onToggle method', () => {
        const registerBoolean = renderHook(() => useRegisterBoolean(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onToggle(name, { test: 'test' });
        });

        expect(registerBoolean.result.current[0]).toEqual(true);
        expect(registerBoolean.result.current[1].data).toEqual({ test: 'test' });
    });
    test('should log an error when using onTrue for a non-registered boolean name', () => {
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

        const { result } = renderHook(() => useGlobalBoolean());

        act(() => {
            result.current.onTrue(name);
        });

        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining(errorMessages.notRegisteredName('onTrue', name)),
        );

        consoleErrorMock.mockRestore();
    });
});

describe('useWatchBoolean', () => {
    test('should initialize the boolean state to false and data to null', () => {
        renderHook(() => useRegisterBoolean(name));

        const watchBoolean = renderHook(() => useWatchBoolean(name));

        expect(watchBoolean.result.current).toEqual([false, null]);
    });
    test('should initialize the boolean state to true and set initial data', () => {
        const name = generateUniqueName();

        const initialData = { test: 'test' };

        const watchBoolean = renderHook(() => useWatchBoolean(name));

        renderHook(() => useRegisterBoolean(name, true, initialData));

        expect(watchBoolean.result.current).toEqual([true, initialData]);
    });
    test('should retain registered boolean state and initial data even when onTrue is called without new data', () => {
        const initialData = { test: 'test' };

        renderHook(() => useRegisterBoolean(name, true, initialData));
        const watchBoolean = renderHook(() => useWatchBoolean(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onTrue(name);
        });

        expect(watchBoolean.result.current).toEqual([true, initialData]);
    });
    test('should retain registered boolean state and initial data even when onToggle is called without new data', () => {
        const initialData = { test: 'test' };

        renderHook(() => useRegisterBoolean(name, true, initialData));
        const watchBoolean = renderHook(() => useWatchBoolean(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onTrue(name);
        });

        expect(watchBoolean.result.current).toEqual([true, initialData]);
    });
    test('should update the boolean state to false when onFalse is called', () => {
        const watchBoolean = renderHook(() => useWatchBoolean(name));

        const registerBoolean = renderHook(() => useRegisterBoolean(name, true));

        act(() => {
            registerBoolean.result.current[1].onToggle();
        });

        expect(watchBoolean.result.current).toEqual([false, null]);
    });
    test('should correctly track multiple watchers for the same boolean state', () => {
        renderHook(() => {
            useWatchBoolean(name);
            useWatchBoolean(name);
            useWatchBoolean(name);
            useWatchBoolean(name);
            useWatchBoolean(name);
            useWatchBoolean(name);
        });

        expect(booleanStateListeners.get(name)!).toBeInstanceOf(Set);
        expect(booleanStateListeners.get(name)!.size).toBe(6);
    });
    test('should update all watchers when the boolean state is changed', () => {
        const registerBoolean = renderHook(() => useRegisterBoolean(name));

        const watchBoolean = renderHook(() => ({
            watch1: useWatchBoolean(name),
            watch2: useWatchBoolean(name),
            watch3: useWatchBoolean(name),
            watch4: useWatchBoolean(name),
            watch5: useWatchBoolean(name),
            watch6: useWatchBoolean(name),
        }));

        act(() => {
            registerBoolean.result.current[1].onTrue();
        });

        expect(watchBoolean.result.current).toEqual({
            watch1: [true, null],
            watch2: [true, null],
            watch3: [true, null],
            watch4: [true, null],
            watch5: [true, null],
            watch6: [true, null],
        });
    });
    test('should update all watchers with the new data when boolean state is changed and data is set', () => {
        const data = { test: 'test' };

        const registerBoolean = renderHook(() => useRegisterBoolean<typeof data>(name));

        const watchBoolean = renderHook(() => ({
            watch1: useWatchBoolean(name),
            watch2: useWatchBoolean(name),
            watch3: useWatchBoolean(name),
            watch4: useWatchBoolean(name),
            watch5: useWatchBoolean(name),
            watch6: useWatchBoolean(name),
        }));

        act(() => {
            registerBoolean.result.current[1].onTrue();
            registerBoolean.result.current[1].setData(data);
        });

        expect(watchBoolean.result.current).toEqual({
            watch1: [true, data],
            watch2: [true, data],
            watch3: [true, data],
            watch4: [true, data],
            watch5: [true, data],
            watch6: [true, data],
        });
    });
});
