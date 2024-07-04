import React, { ReactNode } from 'react';

import { Alert, BodyShort, Box } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import { useFeatureToggles } from '../../context/FeatureToggleContext';
import { ESanitySteg } from '../../typer/sanity/sanity';

export const VedleggNotis: React.FC<{
    children?: ReactNode;
    dynamisk?: boolean;
}> = ({ children, dynamisk = false }) => {
    const { tekster, plainTekst } = useApp();
    const { toggles } = useFeatureToggles();

    return (
        <Alert variant="info" aria-live={dynamisk ? 'polite' : 'off'}>
            {children ? children : null}
            {toggles.NYE_VEDLEGGSTEKSTER && (
                <Box paddingBlock="4 0">
                    <BodyShort>
                        {plainTekst(tekster()[ESanitySteg.DOKUMENTASJON].lastOppSenereISoknad)}
                    </BodyShort>
                </Box>
            )}
        </Alert>
    );
};
