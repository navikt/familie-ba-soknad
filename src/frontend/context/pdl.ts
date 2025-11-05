import { type Ressurs } from '@navikt/familie-typer';

import { ISøkerRespons } from '../typer/person';
import { soknadApiProxyUrl } from '../utils/miljø';

export const hentSluttbrukerFraPdl = (axiosRequest): Promise<Ressurs<ISøkerRespons>> => {
    return axiosRequest({
        url: `${soknadApiProxyUrl}/personopplysning?ytelse=BARNETRYGD`,
        method: 'GET',
        withCredentials: true,
        påvirkerSystemLaster: true,
    });
};
