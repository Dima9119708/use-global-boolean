import '@testing-library/jest-dom';

jest.mock('fast-deep-equal', () => {
    const equal = jest.requireActual('fast-deep-equal');

    return {
        __esModule: true,
        default: jest.fn(equal),
    };
});
