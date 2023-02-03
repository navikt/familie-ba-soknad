import { Ressurs } from '@navikt/familie-typer';

import Miljø from '../../shared-utils/Miljø';
import { ISøkerRespons } from '../typer/person';

export const hentSluttbrukerFraPdl = (axiosRequest): Promise<Ressurs<ISøkerRespons>> => {
    const { soknadApiProxyUrl } = Miljø();
    return axiosRequest({
        url: `${soknadApiProxyUrl}/personopplysning?ytelse=BARNETRYGD`,
        method: 'GET',
        withCredentials: true,
        påvirkerSystemLaster: true,
    });
};
