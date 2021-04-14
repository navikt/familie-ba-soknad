import React, { useState } from 'react';

import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import { useApp } from '../../context/AppContext';
import { IRoute, useRoutes } from '../../routing/RoutesContext';
import { ILokasjon } from '../../typer/lokasjon';

export enum BekreftelseStatus {
    NORMAL = 'NORMAL',
    BEKREFTET = 'BEKREFTET',
    FEIL = 'FEIL',
}

export const useBekreftelseOgStartSoknad = (): {
    onStartSøknad: (event: React.FormEvent) => void;
    bekreftelseOnChange: () => void;
    bekreftelseStatus: BekreftelseStatus;
} => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();

    const { hentNesteRoute, hentRouteIndex } = useRoutes();
    const { søknad, settSøknad, settUtfyltSteg } = useApp();

    const [bekreftelseStatus, settBekreftelseStatus] = useState<BekreftelseStatus>(
        søknad.lestOgForståttBekreftelse ? BekreftelseStatus.BEKREFTET : BekreftelseStatus.NORMAL
    );

    const nesteRoute: IRoute = hentNesteRoute(location.pathname);

    const onStartSøknad = (event: React.FormEvent) => {
        event.preventDefault();
        if (bekreftelseStatus === BekreftelseStatus.BEKREFTET) {
            settSøknad({
                ...søknad,
                lestOgForståttBekreftelse: true,
            });
            settUtfyltSteg(hentRouteIndex(location.pathname));
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
    };
};
