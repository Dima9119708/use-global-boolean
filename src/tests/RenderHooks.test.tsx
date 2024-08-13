import { act, renderHook } from '@testing-library/react';

import { generateUniqueName } from './utils/testUtils.ts';

import { useBooleanController, useGlobalBoolean, useWatchBoolean } from '../lib';
import { errorMessages } from '../lib/errorMessages.ts';
import { booleanStateListeners } from '../lib/globalStates/booleanStateListeners';
import { booleanStateManager } from '../lib/globalStates/booleanStateManager';

let name: string;

beforeEach(() => {
    name = generateUniqueName();
});

describe('booleanStateManager', () => {
    test('should remove the state from booleanStateManager after unmount', () => {
        const { unmount } = renderHook(() => useBooleanController(name));

        unmount();

        expect(booleanStateManager.get(name)).toBe(undefined);
    });
});

describe('booleanStateListeners', () => {
    test('should remove the state from booleanStateManager after unmounting a single hook', () => {
        const { unmount } = renderHook(() => useGlobalBoolean().watchBoolean(name));

        expect(booleanStateListeners.size).toBe(1);

        unmount();

        expect(booleanStateListeners.size).toBe(0);
    });
    test('should remove the state from booleanStateManager after unmounting multiple hooks one by one', () => {
        const hook1 = renderHook(() => useGlobalBoolean().watchBoolean(generateUniqueName()));
        const hook2 = renderHook(() => useGlobalBoolean().watchBoolean(generateUniqueName()));
        const hook3 = renderHook(() => useGlobalBoolean().watchBoolean(generateUniqueName()));
        const hook4 = renderHook(() => useGlobalBoolean().watchBoolean(generateUniqueName()));
        const hook5 = renderHook(() => useGlobalBoolean().watchBoolean(generateUniqueName()));

        expect(booleanStateListeners.size).toBe(5);

        hook1.unmount();

        expect(booleanStateListeners.size).toBe(4);

        hook2.unmount();
        hook3.unmount();
        hook4.unmount();
        hook5.unmount();

        expect(booleanStateListeners.size).toBe(0);
    });
    test('should remove the state from booleanStateListeners after unmounting hooks created with useWatchBoolean', () => {
        const hook1 = renderHook(() => useWatchBoolean(generateUniqueName()));
        const hook2 = renderHook(() => useWatchBoolean(generateUniqueName()));
        const hook3 = renderHook(() => useWatchBoolean(generateUniqueName()));
        const hook4 = renderHook(() => useWatchBoolean(generateUniqueName()));
        const hook5 = renderHook(() => useWatchBoolean(generateUniqueName()));

        expect(booleanStateListeners.size).toBe(5);

        hook1.unmount();

        expect(booleanStateListeners.size).toBe(4);

        hook2.unmount();
        hook3.unmount();
        hook4.unmount();
        hook5.unmount();

        expect(booleanStateListeners.size).toBe(0);
    });
});

describe('useRegisterBoolean', () => {
    test('Should check the default state values', () => {
        const { result } = renderHook(() => useBooleanController(name));

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

        const { result } = renderHook(() => useBooleanController(name, true, initialData));

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
        const { result } = renderHook(() => useBooleanController(name));

        act(() => {
            result.current[1].onTrue();
        });

        expect(result.current[0]).toEqual(true);
    });
    test('Should change state from true to false using the onToggle method', () => {
        const { result } = renderHook(() => useBooleanController(name, true));

        act(() => {
            result.current[1].onToggle();
        });

        expect(result.current[0]).toEqual(false);
    });
    test('Should change state from true to false using the onFalse method', () => {
        const { result } = renderHook(() => useBooleanController(name, true));

        act(() => {
            result.current[1].onToggle();
        });

        expect(result.current[0]).toEqual(false);
    });
    test('Should toggle state between true and false', () => {
        const { result } = renderHook(() => useBooleanController(name, true));

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

        renderHook(() => useBooleanController(name));
        renderHook(() => useBooleanController(name));

        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining(errorMessages.alreadyRegisteredName(name)),
        );

        consoleErrorMock.mockRestore();
    });
});

describe('useGlobalBoolean', () => {
    test('Should set boolean to true using onTrue method', () => {
        const registerBoolean = renderHook(() => useBooleanController(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onTrue(name);
        });

        expect(registerBoolean.result.current[0]).toEqual(true);
    });
    test('Should toggle boolean state to true using onToggle method', () => {
        const registerBoolean = renderHook(() => useBooleanController(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onToggle(name);
        });

        expect(registerBoolean.result.current[0]).toEqual(true);
    });
    test('Should set boolean to false using onFalse method when initial value is true', () => {
        const registerBoolean = renderHook(() => useBooleanController(name, true));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onFalse(name);
        });

        expect(registerBoolean.result.current[0]).toEqual(false);
    });
    test('Should set boolean to true and update data using onTrue method', () => {
        const registerBoolean = renderHook(() => useBooleanController(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onTrue(name, { test: 'test' });
        });

        expect(registerBoolean.result.current[0]).toEqual(true);
        expect(registerBoolean.result.current[1].data).toEqual({ test: 'test' });
    });
    test('Should toggle boolean state to true and update data using onToggle method', () => {
        const registerBoolean = renderHook(() => useBooleanController(name));
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
    test('should return default state for non-registered boolean name', () => {
        const { result } = renderHook(() => {
            const { watchBoolean } = useGlobalBoolean();

            return watchBoolean(name);
        });

        expect(result.current).toEqual([false, null]);
    });
    test('should return default state for registered boolean name with no initial values', () => {
        const { result } = renderHook(() => {
            useBooleanController(name);
            const { watchBoolean } = useGlobalBoolean();

            return watchBoolean(name);
        });

        expect(result.current).toEqual([false, null]);
    });
    test('should return initial state for registered boolean name with initial values', () => {
        const { result } = renderHook(() => {
            useBooleanController(name, false, { test: 'test' });
            const { watchBoolean } = useGlobalBoolean();

            return watchBoolean(name);
        });

        expect(result.current).toEqual([false, { test: 'test' }]);
    });
});

describe('useWatchBoolean', () => {
    test('should initialize the boolean state to false and data to null', () => {
        renderHook(() => useBooleanController(name));

        const watchBoolean = renderHook(() => useWatchBoolean(name));

        expect(watchBoolean.result.current).toEqual([false, null]);
    });
    test('should initialize the boolean state to true and set initial data', () => {
        const name = generateUniqueName();

        const initialData = { test: 'test' };

        const watchBoolean = renderHook(() => useWatchBoolean(name));

        renderHook(() => useBooleanController(name, true, initialData));

        expect(watchBoolean.result.current).toEqual([true, initialData]);
    });
    test('should retain registered boolean state and initial data even when onTrue is called without new data', () => {
        const initialData = { test: 'test' };

        renderHook(() => useBooleanController(name, true, initialData));
        const watchBoolean = renderHook(() => useWatchBoolean(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onTrue(name);
        });

        expect(watchBoolean.result.current).toEqual([true, initialData]);
    });
    test('should retain registered boolean state and initial data even when onToggle is called without new data', () => {
        const initialData = { test: 'test' };

        renderHook(() => useBooleanController(name, true, initialData));
        const watchBoolean = renderHook(() => useWatchBoolean(name));
        const globalBoolean = renderHook(() => useGlobalBoolean());

        act(() => {
            globalBoolean.result.current.onTrue(name);
        });

        expect(watchBoolean.result.current).toEqual([true, initialData]);
    });
    test('should update the boolean state to false when onFalse is called', () => {
        const watchBoolean = renderHook(() => useWatchBoolean(name));

        const registerBoolean = renderHook(() => useBooleanController(name, true));

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
        const registerBoolean = renderHook(() => useBooleanController(name));

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

        const registerBoolean = renderHook(() => useBooleanController<typeof data>(name));

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
