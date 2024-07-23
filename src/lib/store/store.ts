export const booleanStore = new Map<
    string,
    {
        onTrue: () => void;
        setArgs: <Args>(args: Args) => void;
        onFalse: () => void;
        onToggle: () => void;
        componentName: string;
        listeners: Set<(bool: boolean) => void>;
    }
>();
