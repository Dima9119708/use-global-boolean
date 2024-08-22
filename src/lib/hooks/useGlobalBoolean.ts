import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

import equal from 'fast-deep-equal';

import { errorMessages } from '../errorMessages.ts';
import type { Listener } from '../globalStates/booleanStateListeners.ts';
import { booleanStateListeners } from '../globalStates/booleanStateListeners.ts';
import type { BooleanAndData, BooleanStateManagerValues } from '../globalStates/booleanStateManager.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import { forcedCallListener } from '../globalStates/forcedCallListener.ts';
import type { BooleanNames, IsEqual, NewDataOrCallback } from '../types/types.ts';

export type GlobalBooleanMethods = {
    /**
     * @deprecated Use `setTrue` instead. Will be removed in future versions.
     */
    onTrue: <Data = unknown>(uniqueName: BooleanNames, data?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
    setTrue: <Data = unknown>(uniqueName: BooleanNames, data?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
    /**
     * @deprecated Use `setFalse` instead. Will be removed in future versions.
     */
    onFalse: <Data = unknown>(uniqueName: BooleanNames, data?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
    setFalse: <Data = unknown>(uniqueName: BooleanNames, data?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
    /**
     * @deprecated Use `toggle` instead. Will be removed in future versions.
     */
    onToggle: <Data = unknown>(uniqueName: BooleanNames, data?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
    toggle: <Data = unknown>(uniqueName: BooleanNames, data?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
    setData: <Data = unknown>(uniqueName: BooleanNames, data?: NewDataOrCallback<Data>, isEqual?: IsEqual<Data>) => void;
    getFieldState: (uniqueName: BooleanNames) => BooleanStateManagerValues | undefined;
    getFieldStateBoolean: (uniqueName: BooleanNames) => boolean | undefined;
    getFieldStateData: <Data>(uniqueName: BooleanNames) => Data | undefined;
    watchBoolean: <Data = unknown>(uniqueName: BooleanNames, initialBoolean?: boolean, initialData?: Data) => BooleanAndData<Data>;
};

const setTrue = <Data>(uniqueName: BooleanNames, dataOrCallback?: NewDataOrCallback<Data>, isEqual = equal) => {
    const disclosureActions = booleanStateManager.get(uniqueName);

    if (disclosureActions) {
        let newData;

        if (dataOrCallback instanceof Function) {
            newData = dataOrCallback(disclosureActions.booleanAndData[1] as Data);
        } else {
            newData = dataOrCallback;
        }

        disclosureActions.setData(
            newData === undefined
                ? disclosureActions.booleanAndData[1]
                : isEqual(newData, disclosureActions.booleanAndData[1])
                  ? disclosureActions.booleanAndData[1]
                  : newData,
        );
        disclosureActions.setTrue();
    } else {
        console.error(errorMessages.notRegisteredName('setTrue', uniqueName));
    }
};

const setFalse = <Data>(uniqueName: BooleanNames, dataOrCallback?: NewDataOrCallback<Data>, isEqual = equal) => {
    const disclosureActions = booleanStateManager.get(uniqueName);

    if (disclosureActions) {
        let newData;

        if (dataOrCallback instanceof Function) {
            newData = dataOrCallback(disclosureActions.booleanAndData[1] as Data);
        } else {
            newData = dataOrCallback;
        }

        disclosureActions.setData(
            newData === undefined
                ? disclosureActions.booleanAndData[1]
                : isEqual(newData, disclosureActions.booleanAndData[1])
                  ? disclosureActions.booleanAndData[1]
                  : newData,
        );
        disclosureActions.setFalse();
    } else {
        console.error(errorMessages.notRegisteredName('setFalse', uniqueName));
    }
};

const toggle = <Data>(uniqueName: BooleanNames, dataOrCallback?: NewDataOrCallback<Data>, isEqual = equal) => {
    const disclosureActions = booleanStateManager.get(uniqueName);

    if (disclosureActions) {
        let newData;

        if (dataOrCallback instanceof Function) {
            newData = dataOrCallback(disclosureActions.booleanAndData[1] as Data);
        } else {
            newData = dataOrCallback;
        }

        disclosureActions.setData(
            newData === undefined
                ? disclosureActions.booleanAndData[1]
                : isEqual(newData, disclosureActions.booleanAndData[1])
                  ? disclosureActions.booleanAndData[1]
                  : newData,
        );
        disclosureActions.toggle();
    } else {
        console.error(errorMessages.notRegisteredName('toggle', uniqueName));
    }
};

const setData = <Data>(uniqueName: BooleanNames, dataOrCallback?: NewDataOrCallback<Data>, isEqual = equal) => {
    const disclosureActions = booleanStateManager.get(uniqueName);

    if (disclosureActions) {
        let newData;

        if (dataOrCallback instanceof Function) {
            newData = dataOrCallback(disclosureActions.booleanAndData[1] as Data);
        } else {
            newData = dataOrCallback;
        }

        disclosureActions.setData(
            newData === undefined
                ? disclosureActions.booleanAndData[1]
                : isEqual(newData, disclosureActions.booleanAndData[1])
                  ? disclosureActions.booleanAndData[1]
                  : newData,
        );
    } else {
        console.error(errorMessages.notRegisteredName('onToggle', uniqueName));
    }
};

export const globalBooleanActions: Omit<GlobalBooleanMethods, 'watchBoolean'> = {
    onTrue: setTrue,
    onToggle: toggle,
    onFalse: setFalse,
    setTrue: setTrue,
    setFalse: setFalse,
    setData: setData,
    toggle: toggle,
    getFieldState: (uniqueName: BooleanNames) => {
        return booleanStateManager.get(uniqueName);
    },
    getFieldStateBoolean: (uniqueName: BooleanNames) => {
        return booleanStateManager.get(uniqueName)?.booleanAndData[0];
    },
    getFieldStateData: <Data>(uniqueName: BooleanNames) => {
        return booleanStateManager.get(uniqueName)?.booleanAndData[1] as Data;
    },
};

export const useGlobalBoolean = (): GlobalBooleanMethods => {
    const isSnapshotUpdated = useRef({});
    const booleanNamesWithInitialData = useRef<Map<BooleanNames, BooleanAndData>>(new Map());

    const watchBoolean = useCallback(
        <Data = unknown>(uniqueName: BooleanNames, initialBoolean: boolean = false, initialData: Data = null as Data) => {
            const initialValues = [initialBoolean, initialData] as BooleanAndData<Data>;

            if (!booleanNamesWithInitialData.current.has(uniqueName)) {
                booleanNamesWithInitialData.current.set(uniqueName, initialValues);
            }

            return (booleanStateManager.get(uniqueName)?.booleanAndData as BooleanAndData<Data>) ?? initialValues;
        },
        [],
    );

    const subscribeToChanges = useCallback<(onStoreChange: () => void) => () => void>((onStoreChange) => {
        if (booleanNamesWithInitialData.current.size === 0) return () => {};

        const listeners = new Map<BooleanNames, Listener>();

        booleanNamesWithInitialData.current.forEach((initialValues, uniqueName) => {
            let isFirstCall = true;

            const listener = () => {
                if (isFirstCall && equal(initialValues, booleanStateManager.get(uniqueName)?.booleanAndData)) {
                    return;
                }

                isFirstCall = false;
                isSnapshotUpdated.current = {};

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
    }, []);

    const getSnapshot = useCallback(() => isSnapshotUpdated.current, []);

    useSyncExternalStore(subscribeToChanges, getSnapshot);

    useEffect(
        () =>
            function cleanUp() {
                booleanNamesWithInitialData.current.clear();
            },
        [],
    );

    return {
        onTrue: globalBooleanActions.onTrue,
        onFalse: globalBooleanActions.onFalse,
        onToggle: globalBooleanActions.onToggle,
        setTrue: globalBooleanActions.setTrue,
        setFalse: globalBooleanActions.setFalse,
        toggle: globalBooleanActions.toggle,
        setData: globalBooleanActions.setData,
        getFieldState: globalBooleanActions.getFieldState,
        getFieldStateBoolean: globalBooleanActions.getFieldStateBoolean,
        getFieldStateData: globalBooleanActions.getFieldStateData,
        watchBoolean,
    };
};
