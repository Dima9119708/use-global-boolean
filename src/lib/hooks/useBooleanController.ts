import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';

import equal from 'fast-deep-equal';

import { errorMessages } from '../errorMessages.ts';
import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import type { BooleanAndData } from '../globalStates/booleanStateManager.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import { forcedCallListener } from '../globalStates/forcedCallListener.ts';
import type { BooleanNames, IsEqual, NewDataOrCallback } from '../types/types.ts';

export type UseBooleanControllerReturn<Data = unknown> = [
    boolean,
    {
        /**
         * @deprecated Use `setTrue` instead. Will be removed in future versions.
         */
        onTrue: (newDataOrCallback?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
        /**
         * @deprecated Use `setFalse` instead. Will be removed in future versions.
         */
        onFalse: (newDataOrCallback?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
        /**
         * @deprecated Use `toggle` instead. Will be removed in future versions.
         */
        onToggle: (newDataOrCallback?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;

        setTrue: (newDataOrCallback?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
        setFalse: (newDataOrCallback?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
        toggle: (newDataOrCallback?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;

        data: Data;
        setData: Dispatch<SetStateAction<Data>>;
    },
];

/**
 * @deprecated Use `useBooleanController` instead. Will be removed in future versions.
 */
export const useRegisterBoolean = <Data = unknown>(
    uniqueName: BooleanNames,
    initialBoolean: boolean = false,
    initialData: Data = null as Data,
): UseBooleanControllerReturn<Data> => {
    const [boolean, setBoolean] = useState(initialBoolean);
    const [data, setData] = useState<Data>(initialData);

    const defaultValues = useMemo(() => [initialBoolean, initialData] as BooleanAndData<Data>, []);

    const setTrue = useCallback((newDataOrCallback?: NewDataOrCallback<Data>, isEqual = equal) => {
        setBoolean(true);

        if (newDataOrCallback !== undefined && !(newDataOrCallback instanceof Function)) {
            setData((prevState) => {
                return isEqual(newDataOrCallback, prevState) ? prevState : newDataOrCallback;
            });
        }
        if (newDataOrCallback !== undefined && newDataOrCallback instanceof Function) {
            setData((prevData) => newDataOrCallback(prevData));
        }
    }, []);

    const setFalse = useCallback((newDataOrCallback?: NewDataOrCallback<Data>, isEqual = equal) => {
        setBoolean(false);

        if (newDataOrCallback !== undefined && !(newDataOrCallback instanceof Function)) {
            setData((prevState) => {
                return isEqual(newDataOrCallback, prevState) ? prevState : newDataOrCallback;
            });
        }
        if (newDataOrCallback !== undefined && newDataOrCallback instanceof Function) {
            setData((prevData) => newDataOrCallback(prevData));
        }
    }, []);

    const toggle = useCallback((newDataOrCallback?: NewDataOrCallback<Data>, isEqual = equal) => {
        setBoolean((prevState) => !prevState);

        if (newDataOrCallback !== undefined && !(newDataOrCallback instanceof Function)) {
            setData((prevState) => {
                return isEqual(newDataOrCallback, prevState) ? prevState : newDataOrCallback;
            });
        }
        if (newDataOrCallback !== undefined && newDataOrCallback instanceof Function) {
            setData((prevData) => newDataOrCallback(prevData));
        }
    }, []);

    const registerGlobalBooleanState = useCallback(() => {
        booleanStateManager.set(uniqueName, {
            onTrue: setTrue,
            onFalse: setFalse,
            onToggle: toggle,
            setFalse: setFalse,
            setTrue: setTrue,
            toggle: toggle,
            booleanAndData: defaultValues,
            setData: (args) => setData(args as unknown as Data),
        });
    }, [defaultValues, setFalse, toggle, setTrue, uniqueName]);

    useEffect(() => {
        if (!booleanStateManager.has(uniqueName)) {
            registerGlobalBooleanState();
        } else {
            if (uniqueName !== '') {
                console.error(errorMessages.alreadyRegisteredName(uniqueName));
            }
        }

        return () => {
            booleanStateManager.delete(uniqueName);

            if (booleanStateListeners.has(uniqueName)) {
                booleanStateListeners.get(uniqueName)!.forEach((listener) => listener());
            }
        };
    }, [registerGlobalBooleanState, uniqueName]);

    useEffect(() => {
        if (uniqueName === '') return;

        const currentBooleanAndData = [boolean, data];

        booleanStateManager.set(
            uniqueName,
            Object.assign(booleanStateManager.get(uniqueName)!, {
                booleanAndData: currentBooleanAndData,
            }),
        );

        if (booleanStateListeners.has(uniqueName)) {
            booleanStateListeners.get(uniqueName)!.forEach((listener) => listener());
        }

        forcedCallListener.set(uniqueName, (listener) => listener());

        return () => {
            forcedCallListener.delete(uniqueName);
        };
    }, [uniqueName, boolean, data]);

    return [
        boolean,
        {
            setTrue,
            setFalse,
            toggle,

            onTrue: setTrue,
            onFalse: setFalse,
            onToggle: toggle,

            data,
            setData,
        },
    ];
};

export const useBooleanController = useRegisterBoolean;
