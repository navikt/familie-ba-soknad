import React, { FC, ReactNode } from 'react';

import { Alert, Box } from '@navikt/ds-react';

import { useAppContext } from '../../context/AppContext';

import TekstBlock from './Sanity/TekstBlock';

interface SøkerMåBrukePDFProps {
    advarselTekst: ReactNode;
}

export const SøkerMåBrukePDF: FC<SøkerMåBrukePDFProps> = ({ advarselTekst }) => {
    const { tekster } = useAppContext();
    const { brukPDFKontantstoette } = tekster().FELLES.kanIkkeBrukeSoeknad;

    return (
        <Alert variant={'warning'} data-testid="søker-må-bruke-pdf">
            {advarselTekst}
            <Box marginBlock="space-4 space-0">
                <TekstBlock block={brukPDFKontantstoette} />
            </Box>
        </Alert>
    );
};
