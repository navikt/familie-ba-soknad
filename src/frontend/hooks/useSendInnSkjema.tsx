import { useSprakContext } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import { erModellMismatchResponsRessurs } from '../../shared-utils/modellversjon';
import { useApp } from '../context/AppContext';
import Miljø from '../Miljø';
import { ISøknadKontraktV7 } from '../typer/kontrakt/v7';
import { dataISøknadKontraktFormatV7 } from '../utils/mappingTilKontrakt/søknadV7';
import { sendInn } from '../utils/sendInnSkjema';

export const useSendInnSkjema = (): {
    sendInnSkjemaV7: () => Promise<[boolean, ISøknadKontraktV7]>;
} => {
    const { axiosRequest, søknad, settInnsendingStatus, settSisteModellVersjon } = useApp();
    const { soknadApi } = Miljø();
    const [valgtSpråk] = useSprakContext();
    const sendInnSkjemaV7 = async (): Promise<[boolean, ISøknadKontraktV7]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });

        const formatert: ISøknadKontraktV7 = dataISøknadKontraktFormatV7(valgtSpråk, søknad);

        const res = await sendInn<ISøknadKontraktV7>(
            formatert,
            axiosRequest,
            `${soknadApi}/soknad/v7`,
            res => {
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
        sendInnSkjemaV7,
    };
};
