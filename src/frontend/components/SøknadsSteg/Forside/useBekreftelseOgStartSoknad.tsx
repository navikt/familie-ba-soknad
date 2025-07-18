import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router';

import { useAppContext } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import { useStegContext } from '../../../context/StegContext';
import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISteg } from '../../../typer/routes';

export enum BekreftelseStatus {
    NORMAL = 'NORMAL',
    BEKREFTET = 'BEKREFTET',
    FEIL = 'FEIL',
}

export const useBekreftelseOgStartSoknad = (): {
    onStartSøknad: (event: React.FormEvent) => void;
    bekreftelseOnChange: () => void;
    bekreftelseStatus: BekreftelseStatus;
    fortsettPåSøknaden: () => void;
    startPåNytt: () => void;
    visStartPåNyttModal: boolean;
    settVisStartPåNyttModal: (synlig: boolean) => void;
    settSøknadstype: (søknadstype: ESøknadstype) => void;
    søknadstypeFeil: boolean;
    settSøknadstypeFeil: (søknadstypeFeil: boolean) => void;
} => {
    const navigate = useNavigate();
    const [visStartPåNyttModal, settVisStartPåNyttModal] = useState(false);

    const { steg, hentNesteSteg, hentNåværendeStegIndex, settBarnForSteg } = useStegContext();
    const {
        søknad,
        settSøknad,
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        brukMellomlagretVerdi,
        avbrytOgSlettSøknad,
        mellomlagretVerdi,
    } = useAppContext();
    const { settBarnSomTriggerEøs, skalTriggeEøsForBarn, settSøkerTriggerEøs } = useEøsContext();

    const [bekreftelseStatus, settBekreftelseStatus] = useState<BekreftelseStatus>(
        søknad.lestOgForståttBekreftelse ? BekreftelseStatus.BEKREFTET : BekreftelseStatus.NORMAL
    );

    const [søknadstype, settSøknadstype] = useState<ESøknadstype>();
    const [søknadstypeFeil, settSøknadstypeFeil] = useState<boolean>(false);

    const [gjenopprettetFraMellomlagring, settGjenpprettetFraMellomlagring] = useState(false);

    const nesteRoute: ISteg = hentNesteSteg();
    const nåværendeStegIndex = hentNåværendeStegIndex();

    useEffect(() => {
        if (gjenopprettetFraMellomlagring && mellomlagretVerdi) {
            // Sørger for at man blir sendt til første side i søknad dersom man kun har svart på spørsmålene på forsiden.
            const sisteUtfylteSteg = Math.max(mellomlagretVerdi.sisteUtfylteStegIndex, 1);
            navigate(steg[sisteUtfylteSteg].path);
            settGjenpprettetFraMellomlagring(false);
        }
    }, [gjenopprettetFraMellomlagring]);

    const fortsettPåSøknaden = (): void => {
        if (mellomlagretVerdi) {
            const {
                søknad: { barnInkludertISøknaden, søker },
            } = mellomlagretVerdi;

            brukMellomlagretVerdi();
            settBarnForSteg(barnInkludertISøknaden);
            settBarnSomTriggerEøs(
                barnInkludertISøknaden
                    .filter(barn => skalTriggeEøsForBarn(barn))
                    .map(barn => barn.id)
            );
            settSøkerTriggerEøs(søker.triggetEøs);
            settGjenpprettetFraMellomlagring(true);
        } else {
            navigate(nesteRoute.path);
        }
    };
    const startPåNytt = (): void => {
        avbrytOgSlettSøknad();
    };

    const onStartSøknad = (event: React.FormEvent) => {
        event.preventDefault();

        if (bekreftelseStatus === BekreftelseStatus.BEKREFTET && søknadstype != undefined) {
            settSøknadstypeFeil(false);
            settSøknad({
                ...søknad,
                lestOgForståttBekreftelse: true,
                søknadstype: søknadstype,
            });
            if (!erStegUtfyltFrafør(nåværendeStegIndex)) {
                settSisteUtfylteStegIndex(nåværendeStegIndex);
            }
            navigate(nesteRoute.path);
        } else {
            if (søknadstype === undefined) {
                settSøknadstypeFeil(true);
            }
            if (bekreftelseStatus !== BekreftelseStatus.BEKREFTET) {
                settBekreftelseStatus(BekreftelseStatus.FEIL);
            }
        }
    };

    const bekreftelseOnChange = () => {
        settBekreftelseStatus(prevState => {
            return prevState !== BekreftelseStatus.BEKREFTET
                ? BekreftelseStatus.BEKREFTET
                : BekreftelseStatus.NORMAL;
        });
    };
    return {
        onStartSøknad,
        bekreftelseOnChange,
        bekreftelseStatus,
        settSøknadstype,
        fortsettPåSøknaden,
        startPåNytt,
        visStartPåNyttModal,
        settVisStartPåNyttModal,
        søknadstypeFeil,
        settSøknadstypeFeil,
    };
};
