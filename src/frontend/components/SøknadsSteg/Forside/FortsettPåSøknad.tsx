import { useTranslate } from '@hooks/useTranslate';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Button, InfoCard, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { ESanitySteg } from '../../../../common/sanity';
import { useSanityTekster } from '../../../context/SanityContext';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { SlettSøknadenModal } from '../../Felleskomponenter/Steg/SlettSøknadenModal';
import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

export const FortsettPåSøknad: FC = () => {
    const { fortsettPåSøknaden, visStartPåNyttModal, settVisStartPåNyttModal, startPåNytt } =
        useBekreftelseOgStartSoknad();

    const forsidetekster = useSanityTekster(ESanitySteg.FORSIDE);
    const fellestekster = useSanityTekster(ESanitySteg.FELLES);
    const translate = useTranslate();

    return (
        <>
            <InfoCard data-color={'info'}>
                <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
                    <VStack gap={'space-16'}>
                        <TekstBlock block={forsidetekster.mellomlagretAlert} />
                    </VStack>
                </InfoCard.Message>
            </InfoCard>
            <VStack gap="space-32" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                <Button onClick={fortsettPåSøknaden}>{translate(fellestekster.navigasjon.fortsettKnapp)}</Button>
                <Button variant={'secondary'} onClick={() => settVisStartPåNyttModal(true)}>
                    {translate(fellestekster.navigasjon.startPaaNyttKnapp)}
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
