export type BooleanAndData<Data = unknown> = [boolean, Data];

export const booleanStateManager = new Map<
    string,
    {
        onTrue: () => void;
        setData: <Data>(args: Data) => void;
        onFalse: () => void;
        onToggle: () => void;
        booleanAndData: BooleanAndData;
        componentName: string;
    }
>();
