import React from 'react';

import { Alert, Button, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/sanity/sanity';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { SlettSøknadenModal } from '../../Felleskomponenter/Steg/SlettSøknadenModal';

import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

export const FortsettPåSøknad: React.FC = () => {
    const { tekster, plainTekst } = useApp();
    const { fortsettPåSøknaden, visStartPåNyttModal, settVisStartPåNyttModal, startPåNytt } =
        useBekreftelseOgStartSoknad();

    const forsideTekster = tekster().FORSIDE;
    const navigasjonTekster = tekster().FELLES.navigasjon;

    return (
        <>
            <Alert variant={'info'}>
                <TekstBlock
                    block={forsideTekster.mellomlagretAlert}
                    typografi={Typografi.BodyLong}
                />
            </Alert>
            <VStack gap="8" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                <Button onClick={fortsettPåSøknaden}>
                    {plainTekst(navigasjonTekster.fortsettKnapp)}
                </Button>
                <Button variant={'secondary'} onClick={() => settVisStartPåNyttModal(true)}>
                    {plainTekst(navigasjonTekster.startPaaNyttKnapp)}
                </Button>
            </VStack>
            <SlettSøknadenModal
                open={visStartPåNyttModal}
                avbryt={() => settVisStartPåNyttModal(false)}
                startPåNytt={() => startPåNytt()}
            />
        </>
    );
};
