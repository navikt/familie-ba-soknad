import React from 'react';

import { Alert, BodyShort, Box } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import { useFeatureToggles } from '../../context/FeatureToggleContext';
import { ESanitySteg, FlettefeltVerdier, LocaleRecordBlock } from '../../typer/sanity/sanity';

import TekstBlock from './Sanity/TekstBlock';
import SpråkTekst from './SpråkTekst/SpråkTekst';

// TODO: Når toggles.NYE_VEDLEGGSTEKSTER fjernes, fjern også språkTekstId som prop.

export const VedleggNotis: React.FC<{
    block: LocaleRecordBlock;
    flettefelter?: FlettefeltVerdier;
    språkTekstId: string;
    dynamisk?: boolean;
}> = ({ block, flettefelter, språkTekstId, dynamisk = false }) => {
    const { tekster, plainTekst } = useApp();
    const { toggles } = useFeatureToggles();

    const dokumentasjonTekster = tekster()[ESanitySteg.DOKUMENTASJON];
    const { lastOppSenereISoknad } = dokumentasjonTekster;

    return (
        <Alert variant="info" aria-live={dynamisk ? 'polite' : 'off'}>
            {toggles.NYE_VEDLEGGSTEKSTER ? (
                <>
                    <TekstBlock block={block} flettefelter={flettefelter} />
                    <Box paddingBlock="4 0">
                        <BodyShort>{plainTekst(lastOppSenereISoknad)}</BodyShort>
                    </Box>
                </>
            ) : (
                <SpråkTekst id={språkTekstId} />
            )}
        </Alert>
    );
};
