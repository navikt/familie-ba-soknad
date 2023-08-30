import { AxiosError } from 'axios';

import { useSprakContext } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../../shared-utils/Miljø';
import { erModellMismatchResponsRessurs } from '../../shared-utils/modellversjon';
import { useApp } from '../context/AppContext';
import { ISøknadKontraktV8 } from '../typer/kontrakt/v8';
import { dataISøknadKontraktFormatV8 } from '../utils/mappingTilKontrakt/søknadV8';
import { sendInn } from '../utils/sendInnSkjema';

export const useSendInnSkjema = (): {
    sendInnSkjemaV8: () => Promise<[boolean, ISøknadKontraktV8]>;
} => {
    const { axiosRequest, søknad, settInnsendingStatus, settSisteModellVersjon } = useApp();
    const { soknadApiProxyUrl } = Miljø();
    const [valgtSpråk] = useSprakContext();
    const sendInnSkjemaV8 = async (): Promise<[boolean, ISøknadKontraktV8]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });

        const formatert: ISøknadKontraktV8 = dataISøknadKontraktFormatV8(valgtSpråk, søknad);

        const res = await sendInn<ISøknadKontraktV8>(
            formatert,
            axiosRequest,
            `${soknadApiProxyUrl}/soknad/v8`,
            (res: AxiosError) => {
                const responseData = res.response?.data;
                if (responseData && erModellMismatchResponsRessurs(responseData)) {
                    settSisteModellVersjon(responseData.data.modellVersjon);
                }
            }
        );

        settInnsendingStatus(res);

        return [res.status === RessursStatus.SUKSESS, formatert];
    };

    return {
        sendInnSkjemaV8,
    };
};
