import { useComponentName } from './useComponentName.ts';

import { errorMessages } from '../errorMessages.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import type { BooleanNames } from '../types/types.ts';

export const useGlobalBoolean = () => {
    const componentName = useComponentName();

    const onTrue = <Data>(uniqueName: BooleanNames, data: Data = null as Data) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.setData(data);
            disclosureActions.onTrue();
        } else {
            console.error(errorMessages.notRegisteredName(componentName, uniqueName));
        }
    };

    const onFalse = (uniqueName: BooleanNames) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.onFalse();
        } else {
            console.error(errorMessages.notRegisteredName(componentName, uniqueName));
        }
    };

    const onToggle = <Data>(uniqueName: BooleanNames, data: Data = null as Data) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.setData(data);
            disclosureActions.onToggle();
        } else {
            console.error(errorMessages.notRegisteredName(componentName, uniqueName));
        }
    };

    return {
        onTrue,
        onFalse,
        onToggle,
    };
};
