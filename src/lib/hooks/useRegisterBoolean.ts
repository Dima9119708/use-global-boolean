import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { errorMessages } from '../errorMessages.ts';
import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import type { BooleanAndData } from '../globalStates/booleanStateManager.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
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
    const initial = useRef(false);

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

    if (!initial.current) {
        if (booleanStateManager.has(uniqueName)) {
            console.error(errorMessages.alreadyRegisteredName(uniqueName));
        }

        registerGlobalBooleanState();

        initial.current = true;
    }

    useEffect(() => {
        // For strict mode
        if (!booleanStateManager.has(uniqueName)) {
            registerGlobalBooleanState();
        }

        return () => {
            booleanStateManager.delete(uniqueName);
        };
    }, []);

    useEffect(() => {
        if (booleanStateListeners.has(uniqueName)) {
            booleanStateManager.set(
                uniqueName,
                Object.assign(booleanStateManager.get(uniqueName)!, {
                    booleanAndData: [boolean, data],
                }),
            );

            booleanStateListeners.get(uniqueName)!.forEach((listener) => listener(boolean));
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
