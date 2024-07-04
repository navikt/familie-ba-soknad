import React from 'react';

import { Alert } from '@navikt/ds-react';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

export const Feilside: React.FC = () => {
    return (
        <div>
            <Alert variant={'error'} aria-live={'polite'}>
                <SpråkTekst id={'felles.crashmelding'} />
            </Alert>
        </div>
    );
};
