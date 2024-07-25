import { useCallback, useSyncExternalStore } from 'react';

import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import type { BooleanAndData } from '../globalStates/booleanStateManager.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import type { BooleanNames } from '../types/types.ts';

const defaultValues = [false, null];

export const useWatchBoolean = <Payload = unknown>(
    uniqueName: BooleanNames,
): BooleanAndData<Payload> => {
    const subscribe = useCallback<(onStoreChange: () => void) => () => void>(
        (listener) => {
            if (booleanStateListeners.has(uniqueName)) {
                booleanStateListeners.get(uniqueName)!.add(listener);
            } else {
                booleanStateListeners.set(uniqueName, new Set([listener]));
            }

            return () => {
                booleanStateListeners.get(uniqueName)!.delete(listener);
            };
        },
        [uniqueName],
    );

    const getSnapshot = useCallback(() => {
        if (booleanStateManager.has(uniqueName)) {
            return booleanStateManager.get(uniqueName)!.booleanAndData as BooleanAndData<Payload>;
        }

        return defaultValues as BooleanAndData<Payload>;
    }, [uniqueName]);

    return useSyncExternalStore(subscribe, getSnapshot);
};
