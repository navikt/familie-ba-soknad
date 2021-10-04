import { useEffect, useState } from 'react';

import createUseContext from 'constate';

import { byggTomRessurs, Ressurs } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { autentiseringsInterceptor, InnloggetStatus } from '../utils/autentisering';
import { useInnloggetContext } from './InnloggetContext';
import { useLastRessurserContext } from './LastRessurserContext';

const [EøsProvider, useEøs] = createUseContext(() => {
    const { soknadApi } = Miljø();
    const [alleLand, settAlleLand] = useState<Ressurs<Map<string, string>>>(byggTomRessurs());
    const [eosLand, settEosLand] = useState<Ressurs<Map<string, string>>>(byggTomRessurs());

    const { axiosRequest } = useLastRessurserContext();

    const { innloggetStatus } = useInnloggetContext();

    autentiseringsInterceptor();

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
            Promise.all([
                axiosRequest<Map<string, string>, void>({
                    url: `${soknadApi}/kodeverk/alle-land`,
                    method: 'GET',
                    withCredentials: true,
                    påvirkerSystemLaster: true,
                }).then(settAlleLand),
                axiosRequest<Map<string, string>, void>({
                    url: `${soknadApi}/kodeverk/eos-land`,
                    method: 'GET',
                    withCredentials: true,
                    påvirkerSystemLaster: true,
                }).then(settEosLand),
            ]);
        }
    }, [innloggetStatus]);

    return {
        alleLand,
        eosLand,
    };
});

export { EøsProvider, useEøs };
