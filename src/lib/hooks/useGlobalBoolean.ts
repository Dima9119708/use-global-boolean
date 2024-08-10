import { useCallback, useRef, useSyncExternalStore } from 'react';

import equal from 'fast-deep-equal';

import { errorMessages } from '../errorMessages.ts';
import type { Listener } from '../globalStates/booleanStateListeners.ts';
import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import type { BooleanAndData } from '../globalStates/booleanStateManager.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import { forcedCallListener } from '../globalStates/forcedCallListener.ts';
import type { BooleanNames } from '../types/types.ts';

export const useGlobalBoolean = () => {
    const isSnapshotUpdated = useRef(false);
    const booleanNamesWithInitialData = useRef<Map<BooleanNames, BooleanAndData>>(new Map());

    const onTrue = useCallback(<Data>(uniqueName: BooleanNames, data: Data = null as Data) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.setData(data ?? disclosureActions.booleanAndData[1]);
            disclosureActions.onTrue();
        } else {
            console.error(errorMessages.notRegisteredName('onTrue', uniqueName));
        }
    }, []);

    const onFalse = useCallback((uniqueName: BooleanNames) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.onFalse();
        } else {
            console.error(errorMessages.notRegisteredName('onFalse', uniqueName));
        }
    }, []);

    const onToggle = useCallback(<Data>(uniqueName: BooleanNames, data: Data = null as Data) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.setData(data ?? disclosureActions.booleanAndData[1]);
            disclosureActions.onToggle();
        } else {
            console.error(errorMessages.notRegisteredName('onToggle', uniqueName));
        }
    }, []);

    const watchBoolean = useCallback(
        <Data = unknown>(
            uniqueName: BooleanNames,
            initialBoolean: boolean = false,
            initialData: Data = null as Data,
        ) => {
            const initialValues = [initialBoolean, initialData] as BooleanAndData<Data>;

            if (!booleanNamesWithInitialData.current.has(uniqueName)) {
                booleanNamesWithInitialData.current.set(uniqueName, initialValues);
            }

            return (
                (booleanStateManager.get(uniqueName)?.booleanAndData as BooleanAndData<Data>) ??
                initialValues
            );
        },
        [],
    );

    const subscribeToChanges = useCallback<(onStoreChange: () => void) => () => void>(
        (onStoreChange) => {
            if (booleanNamesWithInitialData.current.size === 0) return () => {};

            const listeners = new Map<BooleanNames, Listener>();

            booleanNamesWithInitialData.current.forEach((initialValues, uniqueName) => {
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

                listeners.set(uniqueName, listener);

                if (booleanStateListeners.has(uniqueName)) {
                    booleanStateListeners.get(uniqueName)!.add(listener);
                } else {
                    booleanStateListeners.set(uniqueName, new Set([listener]));
                }

                forcedCallListener.get(uniqueName)?.(listener);
            });

            return () => {
                listeners.forEach((listener, uniqueName) => {
                    booleanStateListeners.get(uniqueName)!.delete(listener);

                    if (booleanStateListeners.get(uniqueName)!.size === 0) {
                        booleanStateListeners.delete(uniqueName);
                    }
                });

                listeners.clear();
            };
        },
        [],
    );

    const getSnapshot = useCallback(() => isSnapshotUpdated.current, []);

    useSyncExternalStore(subscribeToChanges, getSnapshot);

    return {
        onTrue,
        onFalse,
        onToggle,
        watchBoolean,
    };
};
