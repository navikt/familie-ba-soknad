import { Ressurs } from '@navikt/familie-typer';

import Miljø from '../../shared-utils/Miljø';
import { ISøkerRespons } from '../typer/person';

export const hentSluttbrukerFraPdl = (axiosRequest): Promise<Ressurs<ISøkerRespons>> => {
    const { soknadApiProxyUrl } = Miljø();
    return axiosRequest({
        url: `${soknadApiProxyUrl}/personopplysning`, //todo legge på `${soknadApiProxyUrl}/personopplysning?ytelse=BARNETRYGD`,
        method: 'POST',
        withCredentials: true,
        påvirkerSystemLaster: true,
    });
};
