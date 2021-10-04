import { useEffect, useState } from 'react';

import createUseContext from 'constate';

import { hentDataFraRessurs } from '@navikt/familie-typer';

import { basePath } from '../Miljø';
import { EFeatureToggle } from '../typer/feature-toggles';
import { useApp } from './AppContext';

const [EøsProvider, useEøs] = createUseContext(() => {
    const { axiosRequest } = useApp();
    const skruddAvByDefault = true; //TODO denne må endres når EØS går live
    const [eøsSkruddAv, settEøsSkruddAv] = useState(skruddAvByDefault);

    useEffect(() => {
        (async () => {
            const respons = await axiosRequest<boolean, void>({
                url: `${basePath}toggles/${EFeatureToggle.EØS}`,
            });
            settEøsSkruddAv(hentDataFraRessurs(respons) ?? skruddAvByDefault);
        })();
    }, []);

    return { eøsSkruddAv };
});

export { EøsProvider, useEøs };
