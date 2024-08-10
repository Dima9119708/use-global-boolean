import type { BooleanAndData } from './booleanStateManager.ts';

export type IsNeedUpdate = (initialBooleanAndData: BooleanAndData<unknown>) => boolean;

export type Listener = () => void;

export const booleanStateListeners = new Map<string, Set<Listener>>();
