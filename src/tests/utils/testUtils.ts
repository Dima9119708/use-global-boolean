import { v4 as uuidv4 } from 'uuid';

export const generateUniqueName = (prefix: string = 'test'): string => {
    return `${prefix}-${uuidv4()}`;
};
