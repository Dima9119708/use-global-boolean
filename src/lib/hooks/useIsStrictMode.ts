import { useRef } from 'react';

// TODO Maybe this implementation is better
// const fiberTags = new Map<string, number>();
//
// export const useDetectedStrictMode = (uniqueName: string) => {
//     const currentTag =
//         // eslint-disable-next-line
//         // @ts-expect-error
//         React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current?.tag;
//
//     const setFiberTag = () => fiberTags.set(uniqueName, currentTag);
//
//     const isEqualFiberTags = () => fiberTags.get(uniqueName) === currentTag;
//
//     const cleanUp = (callback: () => void) => () => {
//         if (!isEqualFiberTags()) {
//             fiberTags.set(uniqueName, currentTag);
//         } else {
//             callback();
//
//             fiberTags.delete(uniqueName);
//         }
//     };
//
//     return {
//         isEqualTags: isEqualFiberTags,
//         setFiberTag,
//         cleanUp,
//     };
// };

const componentRenderCounts = new Map<string, number>();

export const useIsStrictMode = (uniqueName: string) => {
    const isInitialized = useRef(false);

    if (!isInitialized.current) {
        if (componentRenderCounts.has(uniqueName)) {
            const countRender = componentRenderCounts.get(uniqueName)!;
            componentRenderCounts.set(uniqueName, countRender + 1);
        } else {
            componentRenderCounts.set(uniqueName, 1);
        }

        isInitialized.current = true;
    }

    const isMoreThanOneReRender = () =>
        componentRenderCounts.has(uniqueName) && componentRenderCounts.get(uniqueName)! > 1;

    const cleanUp = (callback: () => void) => () => {
        const countRender = componentRenderCounts.get(uniqueName)!;

        if (countRender === 1) {
            componentRenderCounts.delete(uniqueName);
            callback();
        } else {
            componentRenderCounts.set(uniqueName, 1);
        }
    };

    return {
        isMoreThanOneReRender,
        cleanUp,
    };
};
