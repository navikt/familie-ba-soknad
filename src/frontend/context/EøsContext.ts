import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { Alpha3Code } from 'i18n-iso-countries';

import { RessursStatus } from '@navikt/familie-typer';

import Miljø, { basePath } from '../Miljø';
import { EFeatureToggle } from '../typer/feature-toggles';
import { autentiseringsInterceptor } from '../utils/autentisering';
import { useLastRessurserContext } from './LastRessurserContext';

const [EøsProvider, useEøs] = createUseContext(() => {
    const { axiosRequest } = useLastRessurserContext();

    const skruddAvByDefault = true; //TODO denne må endres når EØS går live
    const [eøsSkruddAv, settEøsSkruddAv] = useState(skruddAvByDefault);

    const [eosLand, settEosLand] = useState<Alpha3Code[]>();

    const { soknadApi } = Miljø();

    autentiseringsInterceptor();

    useEffect(() => {
        (async () => {
            try {
                const toggleRespons = await axiosRequest<boolean, void>({
                    url: `${basePath}toggles/${EFeatureToggle.EØS}`,
                });
                const eøsLandResponse = await axiosRequest<Map<Alpha3Code, string>, void>({
                    url: `${soknadApi}/kodeverk/eos-land`,
                    method: 'GET',
                    påvirkerSystemLaster: true,
                });

                if (
                    toggleRespons.status === RessursStatus.SUKSESS &&
                    eøsLandResponse.status === RessursStatus.SUKSESS
                ) {
                    settEosLand(Object.keys(eøsLandResponse.data) as Alpha3Code[]);
                    settEøsSkruddAv(false);
                } else {
                    settEøsSkruddAv(true);
                }
            } catch (_e) {
                settEøsSkruddAv(true);
            }
        })();
    }, []);

    return {
        eosLand,
        eøsSkruddAv,
    };
});

export { EøsProvider, useEøs };
