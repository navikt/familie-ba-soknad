import React, { ReactNode } from 'react';

import { Alert } from '@navikt/ds-react';

export const VedleggNotis: React.FC<{
    children?: ReactNode;
    dynamisk?: boolean;
}> = ({ children, dynamisk = false }) => {
    return (
        <Alert variant="info" aria-live={dynamisk ? 'polite' : 'off'}>
            {children ? children : null}
        </Alert>
    );
};
