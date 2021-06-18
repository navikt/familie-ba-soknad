import { Scope } from '@sentry/react';

export const labelWithFamilieBaSoknad = (scope: Scope): void => {
    scope.setTag('scopeTag', 'familie-ba-soknad');
};
