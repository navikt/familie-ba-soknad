import React, { useState } from 'react';

import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import { useApp } from '../../context/AppContext';
import { hentNesteRoute, IRoute, useRoutes } from '../../routing/Routes';
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
    const routes = useRoutes();
    const { søknad, settSøknad } = useApp();

    const [bekreftelseStatus, settBekreftelseStatus] = useState<BekreftelseStatus>(
        BekreftelseStatus.NORMAL
    );
    const nesteRoute: IRoute = hentNesteRoute(routes, location.pathname);

    const onStartSøknad = (event: React.FormEvent) => {
        event.preventDefault();
        if (bekreftelseStatus === BekreftelseStatus.BEKREFTET) {
            settSøknad({
                ...søknad,
                lestOgForståttBekreftelse: true,
            });
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
