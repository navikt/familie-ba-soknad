import React from 'react';

import { Alert, Button, VStack } from '@navikt/ds-react';

import { Typografi } from '../../../../common/sanity';
import { useAppContext } from '../../../context/AppContext';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { SlettSøknadenModal } from '../../Felleskomponenter/Steg/SlettSøknadenModal';

import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

export const FortsettPåSøknad: React.FC = () => {
    const { tekster, plainTekst } = useAppContext();
    const { fortsettPåSøknaden, visStartPåNyttModal, settVisStartPåNyttModal, startPåNytt } =
        useBekreftelseOgStartSoknad();

    const forsideTekster = tekster().FORSIDE;
    const navigasjonTekster = tekster().FELLES.navigasjon;

    return (
        <>
            <Alert variant={'info'}>
                <TekstBlock block={forsideTekster.mellomlagretAlert} typografi={Typografi.BodyLong} />
            </Alert>
            <VStack gap="space-8" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                <Button onClick={fortsettPåSøknaden}>{plainTekst(navigasjonTekster.fortsettKnapp)}</Button>
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
