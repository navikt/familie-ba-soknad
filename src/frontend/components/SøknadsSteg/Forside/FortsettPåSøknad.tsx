import React from 'react';

import { Alert, BodyLong, Button, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
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
        <VStack role={'navigation'} gap="8">
            <Alert variant={'info'}>
                <BodyLong>
                    <TekstBlock
                        block={forsideTekster.mellomlagretAlert}
                        brukTypografiWrapper={false}
                    />
                </BodyLong>
            </Alert>
            <VStack gap="8" width={{ sm: 'fit-content' }}>
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
        </VStack>
    );
};
