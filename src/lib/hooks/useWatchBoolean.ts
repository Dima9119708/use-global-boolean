import { useCallback, useRef, useSyncExternalStore } from 'react';

import equal from 'fast-deep-equal';

// import type { IsNeedUpdate } from '../globalStates/booleanStateListeners.ts';
import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import type { BooleanAndData } from '../globalStates/booleanStateManager.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import { forcedCallListener } from '../globalStates/forcedCallListener.ts';
import type { BooleanNames } from '../types/types.ts';

export const useWatchBoolean = <Data = unknown>(
    uniqueName: BooleanNames,
    initialBoolean: boolean = false,
    initialData: Data = null as Data,
): BooleanAndData<Data> => {
    const isSnapshotUpdated = useRef(false);

    const initialValues = [initialBoolean, initialData] as BooleanAndData<Data>;

    const subscribe = useCallback<(onStoreChange: () => void) => () => void>(
        (onStoreChange) => {
            let isFirstCall = true;

            const listener = () => {
                if (
                    isFirstCall &&
                    equal(initialValues, booleanStateManager.get(uniqueName)?.booleanAndData)
                ) {
                    return;
                }

                isFirstCall = false;
                isSnapshotUpdated.current = !isSnapshotUpdated.current;
                onStoreChange();
            };

            if (booleanStateListeners.has(uniqueName)) {
                booleanStateListeners.get(uniqueName)!.add(listener);
            } else {
                booleanStateListeners.set(uniqueName, new Set([listener]));
            }

            forcedCallListener.get(uniqueName)?.(listener);

            return () => {
                booleanStateListeners.get(uniqueName)!.delete(listener);

                if (booleanStateListeners.get(uniqueName)!.size === 0) {
                    booleanStateListeners.delete(uniqueName);
                }
            };
        },
        [uniqueName],
    );

    const getSnapshot = useCallback(() => {
        return isSnapshotUpdated.current;
    }, [uniqueName]);

    useSyncExternalStore(subscribe, getSnapshot);

    return (
        (booleanStateManager.get(uniqueName)?.booleanAndData as BooleanAndData<Data>) ??
        initialValues
    );
};
