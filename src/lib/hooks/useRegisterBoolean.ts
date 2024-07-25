import { useCallback, useEffect, useRef, useState } from 'react';

import { useComponentName } from './useComponentName.ts';
import { useIsStrictMode } from './useIsStrictMode.ts';

import { errorMessages } from '../errorMessages.ts';
import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import type { BooleanNames } from '../types/types.ts';

export const useRegisterBoolean = <Data = unknown>(
    uniqueName: BooleanNames,
    initialBoolean: boolean = false,
    initialData: Data = null as Data,
): [boolean, { onTrue: () => void; onFalse: () => void; onToggle: () => void; data: Data }] => {
    const componentName = useComponentName();
    const initial = useRef(false);

    const { cleanUp, isMoreThanOneReRender } = useIsStrictMode(uniqueName);

    const [boolean, setBoolean] = useState(initialBoolean);
    const [data, setData] = useState<Data>(initialData);

    const onTrue = useCallback(() => setBoolean(true), []);

    const onFalse = useCallback(() => setBoolean(false), []);

    const onToggle = useCallback(() => setBoolean((prev) => !prev), []);

    if (!initial.current) {
        if (booleanStateManager.has(uniqueName)) {
            const data = booleanStateManager.get(uniqueName)!;

            if (!isMoreThanOneReRender()) {
                console.error(errorMessages.alreadyRegisteredName(data.componentName, uniqueName));
            }
        }

        booleanStateManager.set(uniqueName, {
            onTrue,
            onFalse,
            onToggle,
            componentName,
            booleanAndData: [boolean, data],
            setData: (args) => setData(args as unknown as Data),
        });

        initial.current = true;
    }

    useEffect(() => {
        return cleanUp(() => {
            booleanStateManager.delete(uniqueName);
        });
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
        },
    ];
};
