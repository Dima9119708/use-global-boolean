export const errorMessages = {
    notRegisteredName: (componentName: string, uniqueName: string) =>
        `Error in component "${componentName}": The name "${uniqueName}" passed to prop "name" is not registered in the useRegisterBoolean hook.`,
    alreadyRegisteredName: (componentName: string, uniqueName: string) =>
        `Error in component "${componentName}": The name "${uniqueName}" has already been registered.`,
    stateChangedTooQuickly: (componentName: string) =>
        `Warning in component "${componentName}": State changed too quickly after initialization. Please check the initial value in useBooleanWatch`,
};
