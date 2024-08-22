export type BooleanAndData<Data = unknown> = [boolean, Data];

export interface BooleanStateManagerValues {
    onTrue: () => void;
    setData: <Data>(args: Data) => void;
    onFalse: () => void;
    onToggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
    toggle: () => void;
    booleanAndData: BooleanAndData;
}

export const booleanStateManager = new Map<string, BooleanStateManagerValues>();
