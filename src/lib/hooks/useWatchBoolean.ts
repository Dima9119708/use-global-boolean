import { useEffect, useState } from 'react';

import { useComponentName } from './useComponentName.ts';

import { errorMessages } from '../errorMessages.ts';
import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
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

        if (booleanStateListeners.has(uniqueName)) {
            booleanStateListeners.get(uniqueName)!.add(listener);
        } else {
            booleanStateListeners.set(uniqueName, new Set([listener]));
        }

        return () => {
            booleanStateListeners.get(uniqueName)!.delete(listener);
        };
    }, [initialBoolean, uniqueName, componentName]);

    return boolean;
};
