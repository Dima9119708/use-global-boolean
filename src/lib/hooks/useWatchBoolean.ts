import { useEffect, useState } from 'react';

import { useComponentName } from './useComponentName.ts';

import { errorMessages } from '../errorMessages.ts';
import { booleanStore } from '../store/store.ts';
import type { BooleanNames } from '../types/types.ts';

export const useWatchBoolean = (uniqueName: BooleanNames, initialBoolean: boolean = false) => {
    const [boolean, setBoolean] = useState(initialBoolean);

    const componentName = useComponentName();

    useEffect(() => {
        const startTime = performance.now();

        const listener = (open: boolean) => {
            const timeElapsed = performance.now() - startTime;

            if (boolean !== open && timeElapsed < 10) {
                console.error(errorMessages.stateChangedTooQuickly(componentName), {
                    uniqueName,
                    initialBoolean,
                    boolean,
                    timeElapsed,
                });
            }

            setBoolean(open);
        };

        const data = booleanStore.get(uniqueName);

        if (data) {
            data.listeners.add(listener);
        } else {
            console.error(errorMessages.notRegisteredName(componentName, uniqueName));
        }

        return () => {
            if (data) {
                data.listeners.delete(listener);
            }
        };
    }, [initialBoolean, uniqueName, componentName]);

    return boolean;
};
