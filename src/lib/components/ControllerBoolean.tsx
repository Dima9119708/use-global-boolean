import type { FunctionComponent } from 'react';

import type { UseBooleanControllerReturn } from '../hooks/useBooleanController.ts';
import { useBooleanController } from '../hooks/useBooleanController.ts';
import type { GlobalBooleanMethods } from '../hooks/useGlobalBoolean';
import { useGlobalBoolean } from '../hooks/useGlobalBoolean';
import type { BooleanNames } from '../types/types';

interface BooleanControllerProps<Data = unknown> {
    name?: BooleanNames;
    children: FunctionComponent<{
        localState: UseBooleanControllerReturn<Data>;
        globalState: GlobalBooleanMethods;
    }>;
    initialBoolean?: boolean;
    initialData?: Data;
}

export const BooleanController = <Data = unknown,>(props: BooleanControllerProps<Data>) => {
    const { name = '', children, initialBoolean, initialData } = props;

    const globalBooleanMethods = useGlobalBoolean();
    const controllerMethods = useBooleanController(name, initialBoolean, initialData);

    return children({
        localState: controllerMethods,
        globalState: globalBooleanMethods,
    });
};
