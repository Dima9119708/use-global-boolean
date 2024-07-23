import React from 'react';

export const useComponentName = () => {
    const Component =
        // eslint-disable-next-line
        // @ts-expect-error
        React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentOwner?.current?.type;

    return Component?.displayName ?? Component?.name;
};
