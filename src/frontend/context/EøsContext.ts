import { useEffect, useState } from 'react';

import createUseContext from 'constate';

import { byggTomRessurs, hentDataFraRessurs, Ressurs } from '@navikt/familie-typer';

import Miljø, { basePath } from '../Miljø';
import { EFeatureToggle } from '../typer/feature-toggles';
import { autentiseringsInterceptor, InnloggetStatus } from '../utils/autentisering';
import { useInnloggetContext } from './InnloggetContext';
import { useLastRessurserContext } from './LastRessurserContext';

const [EøsProvider, useEøs] = createUseContext(() => {
    const { innloggetStatus } = useInnloggetContext();
    const { axiosRequest } = useLastRessurserContext();

    const skruddAvByDefault = true; //TODO denne må endres når EØS går live
    const [eøsSkruddAv, settEøsSkruddAv] = useState(skruddAvByDefault);

    const [eosLand, settEosLand] = useState<Ressurs<Map<string, string>>>(byggTomRessurs());
    const [alleLand, settAlleLand] = useState<Ressurs<Map<string, string>>>(byggTomRessurs());

    const { soknadApi } = Miljø();

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

    useEffect(() => {
        (async () => {
            const respons = await axiosRequest<boolean, void>({
                url: `${basePath}toggles/${EFeatureToggle.EØS}`,
            });
            settEøsSkruddAv(hentDataFraRessurs(respons) ?? skruddAvByDefault);
        })();
    }, []);

    return {
        alleLand,
        eosLand,
        eøsSkruddAv,
    };
});

export { EøsProvider, useEøs };
