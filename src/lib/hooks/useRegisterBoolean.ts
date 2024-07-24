import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import { useComponentName } from './useComponentName.ts';

import { errorMessages } from '../errorMessages.ts';
import { booleanStore } from '../store/store.ts';
import type { BooleanNames } from '../types/types.ts';

export const useRegisterBoolean = <Args = unknown>(
    uniqueName: BooleanNames,
    initialBoolean: boolean = false,
    initialArgs: Args = null as Args,
): [boolean, { onTrue: () => void; onFalse: () => void; onToggle: () => void; args: Args }] => {
    const componentName = useComponentName();

    const [boolean, setBoolean] = useState(initialBoolean);
    const [args, setArgs] = useState<Args>(initialArgs);

    const onTrue = useCallback(() => setBoolean(true), []);

    const onFalse = useCallback(() => setBoolean(false), []);

    const onToggle = useCallback(() => setBoolean((prev) => !prev), []);

    const subscribe = useCallback(() => {
        if (booleanStore.has(uniqueName)) {
            const data = booleanStore.get(uniqueName)!;

            console.error(errorMessages.alreadyRegisteredName(data.componentName, uniqueName));
        } else {
            booleanStore.set(uniqueName, {
                onTrue: onTrue,
                onFalse: onFalse,
                onToggle,
                componentName,
                setArgs: (args) => setArgs(args as unknown as Args),
                listeners: new Set(),
            });
        }
        return () => booleanStore.delete(uniqueName);
    }, [componentName, onFalse, onToggle, onTrue, uniqueName]);

    useSyncExternalStore(subscribe, () => null);

    useEffect(() => {
        const data = booleanStore.get(uniqueName);

        if (data) {
            data.listeners.forEach((listener) => listener(boolean));
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
