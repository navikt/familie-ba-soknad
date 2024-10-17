import React, { FC, ReactNode } from 'react';

import { Alert, Box } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';

import TekstBlock from './Sanity/TekstBlock';

interface SøkerMåBrukePDFProps {
    advarselTekst: ReactNode;
}

export const SøkerMåBrukePDF: FC<SøkerMåBrukePDFProps> = ({ advarselTekst }) => {
    const { tekster } = useApp();
    const { brukPDFKontantstoette } = tekster().FELLES.kanIkkeBrukeSoeknad;

    return (
        <Alert variant={'warning'}>
            {advarselTekst}
            <Box marginBlock="3 0">
                <TekstBlock block={brukPDFKontantstoette} />
            </Box>
        </Alert>
    );
};
