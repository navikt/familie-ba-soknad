import React, { ReactNode } from 'react';

import {
    ArrowLeftIcon,
    ArrowRightIcon,
    FloppydiskIcon,
    PaperplaneIcon,
    TrashIcon,
} from '@navikt/aksel-icons';
import { Box, Button, HGrid, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { RouteEnum } from '../../../typer/routes';
import { LocaleRecordString } from '../../../typer/sanity/sanity';
import { useBekreftelseOgStartSoknad } from '../../SøknadsSteg/Forside/useBekreftelseOgStartSoknad';

import { SlettSøknadenModal } from './SlettSøknadenModal';

type Knappetype = 'primary' | 'secondary';

const Navigeringspanel: React.FC<{
    onAvbrytCallback: () => void;
    onTilbakeCallback: () => void;
    valideringErOk: (() => boolean) | undefined;
}> = ({ onAvbrytCallback, onTilbakeCallback, valideringErOk }) => {
    const { hentNesteSteg } = useSteg();
    const nesteSteg = hentNesteSteg();
    const { innsendingStatus, tekster, plainTekst } = useApp();
    const { visStartPåNyttModal, settVisStartPåNyttModal, startPåNytt } =
        useBekreftelseOgStartSoknad();

    const {
        sendSoeknadKnapp,
        gaaVidereKnapp,
        tilbakeKnapp,
        fortsettSenereKnapp,
        slettSoeknadKnapp,
    } = tekster().FELLES.navigasjon;

    const hentKnappetype = (): Knappetype => {
        return valideringErOk && valideringErOk() ? 'primary' : 'secondary';
    };

    const hentKnappeIkon = (): ReactNode => {
        return nesteSteg.route === RouteEnum.Kvittering ? (
            <PaperplaneIcon aria-hidden />
        ) : (
            <ArrowRightIcon aria-hidden />
        );
    };

    const hentKnappeSpråkTekstId = (): LocaleRecordString => {
        return nesteSteg.route === RouteEnum.Kvittering ? sendSoeknadKnapp : gaaVidereKnapp;
    };

    return (
        <>
            <Box marginBlock="12 0">
                <VStack gap="4">
                    <HGrid
                        gap={{ xs: '4', sm: '8 4' }}
                        columns={{ xs: 1, sm: 2 }}
                        width={{ sm: 'fit-content' }}
                    >
                        <Button
                            type={'button'}
                            variant="secondary"
                            onClick={onTilbakeCallback}
                            icon={<ArrowLeftIcon aria-hidden />}
                            iconPosition="left"
                        >
                            {plainTekst(tilbakeKnapp)}
                        </Button>
                        <Button
                            type={'submit'}
                            variant={hentKnappetype()}
                            icon={hentKnappeIkon()}
                            iconPosition="right"
                            loading={innsendingStatus.status === RessursStatus.HENTER}
                        >
                            {plainTekst(hentKnappeSpråkTekstId())}
                        </Button>

                        <Box asChild marginBlock={{ xs: '4 0', sm: '0' }}>
                            <Button
                                variant="tertiary"
                                type={'button'}
                                onClick={onAvbrytCallback}
                                icon={<FloppydiskIcon aria-hidden />}
                                iconPosition="left"
                            >
                                {plainTekst(fortsettSenereKnapp)}
                            </Button>
                        </Box>
                        <Button
                            variant="tertiary"
                            type={'button'}
                            icon={<TrashIcon aria-hidden />}
                            iconPosition="left"
                            onClick={() => settVisStartPåNyttModal(true)}
                        >
                            {plainTekst(slettSoeknadKnapp)}
                        </Button>
                    </HGrid>
                </VStack>
            </Box>
            <SlettSøknadenModal
                open={visStartPåNyttModal}
                avbryt={() => settVisStartPåNyttModal(false)}
                startPåNytt={() => startPåNytt()}
            />
        </>
    );
};

export default Navigeringspanel;
