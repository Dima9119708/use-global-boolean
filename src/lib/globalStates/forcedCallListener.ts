import type { Listener } from './booleanStateListeners.ts';

import type { BooleanNames } from '../types/types.ts';

export const forcedCallListener = new Map<BooleanNames, (listener: Listener) => void>();
