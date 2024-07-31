import { errorMessages } from '../errorMessages.ts';
import { booleanStateManager } from '../globalStates/booleanStateManager.ts';
import type { BooleanNames } from '../types/types.ts';

export const useGlobalBoolean = () => {
    const onTrue = <Data>(uniqueName: BooleanNames, data: Data = null as Data) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.setData(data ?? disclosureActions.booleanAndData[1]);
            disclosureActions.onTrue();
        } else {
            console.error(errorMessages.notRegisteredName('onTrue', uniqueName));
        }
    };

    const onFalse = (uniqueName: BooleanNames) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.onFalse();
        } else {
            console.error(errorMessages.notRegisteredName('onFalse', uniqueName));
        }
    };

    const onToggle = <Data>(uniqueName: BooleanNames, data: Data = null as Data) => {
        const disclosureActions = booleanStateManager.get(uniqueName);

        if (disclosureActions) {
            disclosureActions.setData(data ?? disclosureActions.booleanAndData[1]);
            disclosureActions.onToggle();
        } else {
            console.error(errorMessages.notRegisteredName('onToggle', uniqueName));
        }
    };

    return {
        onTrue,
        onFalse,
        onToggle,
    };
};
