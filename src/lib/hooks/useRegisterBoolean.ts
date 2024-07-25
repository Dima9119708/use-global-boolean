import { useCallback, useEffect, useRef, useState } from 'react';

import { useComponentName } from './useComponentName.ts';
import { useIsStrictMode } from './useIsStrictMode.ts';

import { errorMessages } from '../errorMessages.ts';
import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import type { BooleanNames } from '../types/types.ts';

export const useRegisterBoolean = <Args = unknown>(
    uniqueName: BooleanNames,
    initialBoolean: boolean = false,
    initialArgs: Args = null as Args,
): [boolean, { onTrue: () => void; onFalse: () => void; onToggle: () => void; args: Args }] => {
    const componentName = useComponentName();
    const initial = useRef(false);

    const { cleanUp, isMoreThanOneReRender } = useIsStrictMode(uniqueName);

    const [boolean, setBoolean] = useState(initialBoolean);
    const [args, setArgs] = useState<Args>(initialArgs);

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
            setArgs: (args) => setArgs(args as unknown as Args),
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
            booleanStateListeners.get(uniqueName)!.forEach((listener) => listener(boolean));
        }
    }, [uniqueName, boolean]);

    return [
        boolean,
        {
            onTrue,
            onFalse,
            onToggle,
            args,
        },
    ];
};
