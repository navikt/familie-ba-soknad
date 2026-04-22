import React from 'react';

import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Button, InfoCard, VStack } from '@navikt/ds-react';

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
            <InfoCard data-color={'info'}>
                <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
                    <VStack gap={'space-16'}>
                        <TekstBlock block={forsideTekster.mellomlagretAlert} />
                    </VStack>
                </InfoCard.Message>
            </InfoCard>
            <VStack gap="space-32" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
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
