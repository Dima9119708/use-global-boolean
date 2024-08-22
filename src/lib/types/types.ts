export interface ListBooleanNames {}

export type BooleanNames = keyof ListBooleanNames | string;

export type IsEqual<Data> = (a: Data, b: Data) => boolean;

export type NewDataOrCallback<Data> = Data | ((prevData: Data) => Data);
