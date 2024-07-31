export const errorMessages = {
    notRegisteredName: (methodName: string, uniqueName: string) =>
        `The name "${uniqueName}" passed to the method "${methodName}" has not been registered. To register the name, use the useRegisterBoolean hook.`,
    alreadyRegisteredName: (uniqueName: string) =>
        `The name "${uniqueName}" passed to the useRegisterBoolean hook has already been registered.`,
};
