import { useEffect, useState } from 'react';

import createUseContext from 'constate';

import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { hentSøknadstype } from '../typer/søknad';
import { autentiseringsInterceptor, InnloggetStatus } from '../utils/autentisering';
import { useLastRessurserContext } from './LastRessurserContext';

const [InnloggetProvider, useInnloggetContext] = createUseContext(() => {
    const { axiosRequest, ressurserSomLaster } = useLastRessurserContext();

    const [innloggetStatus, settInnloggetStatus] = useState<InnloggetStatus>(
        InnloggetStatus.IKKE_VERIFISERT
    );

    const { soknadApi } = Miljø();

    autentiseringsInterceptor();

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.IKKE_VERIFISERT) {
            verifiserAtBrukerErAutentisert(settInnloggetStatus);
        }
    }, [innloggetStatus]);

    const verifiserAtBrukerErAutentisert = (
        settInnloggetStatus: (innloggetStatus: InnloggetStatus) => void
    ) => {
        return axiosRequest({
            url: `${soknadApi}/innlogget`,
            method: 'GET',
            params: { søknadstype: hentSøknadstype() },
            withCredentials: true,
            påvirkerSystemLaster: true,
        })
            .then(ressurs => {
                if (ressurs.status === RessursStatus.SUKSESS) {
                    settInnloggetStatus(InnloggetStatus.AUTENTISERT);
                } else {
                    settInnloggetStatus(InnloggetStatus.FEILET);
                }
            })
            .catch(_ => {
                settInnloggetStatus(InnloggetStatus.FEILET);
            });
    };

    const systemetLaster = () => {
        return ressurserSomLaster.length > 0 || innloggetStatus === InnloggetStatus.IKKE_VERIFISERT;
    };

    return {
        innloggetStatus,
        systemetLaster,
    };
});

export { InnloggetProvider, useInnloggetContext };
