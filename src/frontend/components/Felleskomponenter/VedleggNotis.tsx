import React, { ReactNode } from 'react';

import { Alert } from '@navikt/ds-react';

import SpråkTekst from './SpråkTekst/SpråkTekst';

export const VedleggNotis: React.FC<{
    språkTekstId: string;
    dynamisk?: boolean;
    språkValues?: Record<string, ReactNode>;
}> = ({ språkTekstId, dynamisk = false, språkValues = {} }) => {
    return (
        <Alert variant="info" aria-live={dynamisk ? 'polite' : 'off'}>
            <SpråkTekst id={språkTekstId} values={språkValues} />
        </Alert>
    );
};
