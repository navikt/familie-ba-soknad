import React, { FC, ReactNode } from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Box, InfoCard } from '@navikt/ds-react';

import { useAppContext } from '../../context/AppContext';

import TekstBlock from './Sanity/TekstBlock';

interface SøkerMåBrukePDFProps {
    advarselTekst: ReactNode;
}

export const SøkerMåBrukePDF: FC<SøkerMåBrukePDFProps> = ({ advarselTekst }) => {
    const { tekster } = useAppContext();
    const { brukPDFKontantstoette } = tekster().FELLES.kanIkkeBrukeSoeknad;

    return (
        <InfoCard data-color={'warning'} data-testid="søker-må-bruke-pdf">
            <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>
                {advarselTekst}
                <Box marginBlock="space-12 space-0">
                    <TekstBlock block={brukPDFKontantstoette} />
                </Box>
            </InfoCard.Message>
        </InfoCard>
    );
};
