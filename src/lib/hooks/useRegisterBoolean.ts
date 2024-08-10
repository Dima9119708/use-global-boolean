import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { errorMessages } from '../errorMessages.ts';
import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import type { BooleanAndData } from '../globalStates/booleanStateManager.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import { forcedCallListener } from '../globalStates/forcedCallListener.ts';
import type { BooleanNames } from '../types/types.ts';

export const useRegisterBoolean = <Data = unknown>(
    uniqueName: BooleanNames,
    initialBoolean: boolean = false,
    initialData: Data = null as Data,
): [
    boolean,
    {
        onTrue: () => void;
        onFalse: () => void;
        onToggle: () => void;
        data: Data;
        setData: Dispatch<SetStateAction<Data>>;
    },
] => {
    const [boolean, setBoolean] = useState(initialBoolean);
    const [data, setData] = useState<Data>(initialData);

    const defaultValues = useMemo(() => [initialBoolean, initialData] as BooleanAndData<Data>, []);

    const onTrue = useCallback(() => setBoolean(true), []);

    const onFalse = useCallback(() => setBoolean(false), []);

    const onToggle = useCallback(() => setBoolean((prev) => !prev), []);

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
            console.error(errorMessages.alreadyRegisteredName(uniqueName));
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
