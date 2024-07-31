import { useCallback, useRef, useSyncExternalStore } from 'react';

import equal from 'fast-deep-equal';

import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import type { BooleanAndData } from '../globalStates/booleanStateManager.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import type { BooleanNames } from '../types/types.ts';

export const useWatchBoolean = <Payload = unknown>(
    uniqueName: BooleanNames,
    initialBoolean: boolean = false,
    initialData: Payload = null as Payload,
): BooleanAndData<Payload> => {
    const hasBooleanState = useRef(true);
    const snapshot = useRef([initialBoolean, initialData] as BooleanAndData<Payload>);

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
            if (hasBooleanState.current) {
                return booleanStateManager.get(uniqueName)!
                    .booleanAndData as BooleanAndData<Payload>;
            } else {
                if (equal(snapshot.current, booleanStateManager.get(uniqueName)!.booleanAndData)) {
                    return snapshot.current;
                }

                hasBooleanState.current = true;

                return booleanStateManager.get(uniqueName)!
                    .booleanAndData as BooleanAndData<Payload>;
            }
        }

        hasBooleanState.current = false;

        return snapshot.current;
    }, [uniqueName]);

    return useSyncExternalStore(subscribe, getSnapshot);
};
