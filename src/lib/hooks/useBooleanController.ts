import {
    type Dispatch,
    type SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import equal from 'fast-deep-equal';

import { errorMessages } from '../errorMessages.ts';
import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import type { BooleanAndData } from '../globalStates/booleanStateManager.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import { forcedCallListener } from '../globalStates/forcedCallListener.ts';
import type { BooleanNames, IsEqual } from '../types/types.ts';

export type UseBooleanControllerReturn<Data> = [
    boolean,
    {
        onTrue: (newData?: Data, isEqual?: IsEqual<Data>) => void;
        onFalse: (newData?: Data, isEqual?: IsEqual<Data>) => void;
        onToggle: (newData?: Data, isEqual?: IsEqual<Data>) => void;
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

    const onTrue = useCallback((newData?: Data, isEqual = equal) => {
        setBoolean(true);

        if (newData !== undefined) {
            setData((prevState) => {
                return isEqual(newData, prevState) ? prevState : newData;
            });
        }
    }, []);

    const onFalse = useCallback((newData?: Data, isEqual = equal) => {
        setBoolean(false);

        if (newData !== undefined) {
            setData((prevState) => {
                return isEqual(newData, prevState) ? prevState : newData;
            });
        }
    }, []);

    const onToggle = useCallback((newData?: Data, isEqual = equal) => {
        setBoolean((prev) => !prev);

        if (newData !== undefined) {
            setData((prevState) => {
                return isEqual(newData, prevState) ? prevState : newData;
            });
        }
    }, []);

    const registerGlobalBooleanState = useCallback(() => {
        booleanStateManager.set(uniqueName, {
            onTrue,
            onFalse,
            onToggle,
            booleanAndData: defaultValues,
            setData: (args) => setData(args as unknown as Data),
        });
    }, [defaultValues, onFalse, onToggle, onTrue, uniqueName]);

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
        };
    }, [registerGlobalBooleanState, uniqueName]);

    useEffect(() => {
        const currentBooleanAndData = [boolean, data];

        booleanStateManager.set(
            uniqueName,
            Object.assign(booleanStateManager.get(uniqueName)!, {
                booleanAndData: currentBooleanAndData,
            }),
        );

        if (booleanStateListeners.has(uniqueName)) {
            booleanStateListeners.get(uniqueName)!.forEach((listener) => listener());
        } else {
            forcedCallListener.set(uniqueName, (listener) => listener());
        }

        return () => {
            forcedCallListener.delete(uniqueName);
        };
    }, [uniqueName, boolean, data]);

    return [
        boolean,
        {
            onTrue,
            onFalse,
            onToggle,
            data,
            setData,
        },
    ];
};

export const useBooleanController = useRegisterBoolean;
