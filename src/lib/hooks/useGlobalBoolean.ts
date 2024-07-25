import { useComponentName } from './useComponentName.ts';

import { errorMessages } from '../errorMessages.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import type { BooleanNames } from '../types/types.ts';

export const useGlobalBoolean = () => {
    const componentName = useComponentName();

    const onTrue = <Args>(uniqueName: BooleanNames, args?: Args) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.setArgs(args);
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

    const onToggle = <Args>(uniqueName: BooleanNames, args?: Args) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.setArgs(args);
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
