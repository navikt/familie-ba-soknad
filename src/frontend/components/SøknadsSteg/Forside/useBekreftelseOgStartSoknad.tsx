import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import { useApp } from '../../../context/AppContext';
import { IRoute, useRoutes } from '../../../context/RoutesContext';
import { ILokasjon } from '../../../typer/lokasjon';
import { logForsettPåSøknad, logSkjemaStartet } from '../../../utils/amplitude';

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
} => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const [visStartPåNyttModal, settVisStartPåNyttModal] = useState(false);

    const { hentNesteRoute, hentRouteIndex } = useRoutes();
    const {
        søknad,
        settSøknad,
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        brukMellomlagretVerdi,
        avbrytOgSlettSøknad,
        mellomlagretVerdi,
    } = useApp();
    const {
        settBarnForRoutes,
        hentGjeldendeRoutePåStegindex,
        oppdatertEtterMellomlagring,
        settOppdatertEtterMellomlagring,
    } = useRoutes();

    const [bekreftelseStatus, settBekreftelseStatus] = useState<BekreftelseStatus>(
        søknad.lestOgForståttBekreftelse ? BekreftelseStatus.BEKREFTET : BekreftelseStatus.NORMAL
    );

    const nesteRoute: IRoute = hentNesteRoute(location.pathname);
    const nåværendeStegIndex = hentRouteIndex(location.pathname);

    useEffect(() => {
        if (oppdatertEtterMellomlagring && mellomlagretVerdi) {
            history.push(
                hentGjeldendeRoutePåStegindex(mellomlagretVerdi.sisteUtfylteStegIndex).path
            );
            settOppdatertEtterMellomlagring(false);
        }
    }, [oppdatertEtterMellomlagring]);

    const fortsettPåSøknaden = (): void => {
        if (mellomlagretVerdi) {
            brukMellomlagretVerdi();
            settBarnForRoutes(mellomlagretVerdi.søknad.barnInkludertISøknaden);
            settOppdatertEtterMellomlagring(true);
        } else {
            brukMellomlagretVerdi();
            history.push(nesteRoute.path);
        }
        logForsettPåSøknad(søknad.søknadstype);
    };

    const startPåNytt = (): void => {
        avbrytOgSlettSøknad();
    };

    const onStartSøknad = (event: React.FormEvent) => {
        event.preventDefault();
        if (bekreftelseStatus === BekreftelseStatus.BEKREFTET) {
            settSøknad({
                ...søknad,
                lestOgForståttBekreftelse: true,
            });
            if (!erStegUtfyltFrafør(nåværendeStegIndex)) {
                settSisteUtfylteStegIndex(nåværendeStegIndex);
            }
            logSkjemaStartet(søknad.søknadstype);
            history.push(nesteRoute.path);
        } else {
            settBekreftelseStatus(BekreftelseStatus.FEIL);
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
        fortsettPåSøknaden,
        startPåNytt,
        visStartPåNyttModal,
        settVisStartPåNyttModal,
    };
};
