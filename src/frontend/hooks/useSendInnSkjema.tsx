import { useSprakContext } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import {
    erModellMismatchResponsRessurs,
    modellVersjon,
    modellVersjonHeaderName,
} from '../../shared-utils/modellversjon';
import { useApp } from '../context/AppContext';
import Miljø from '../Miljø';
import { ISøknadKontrakt } from '../typer/kontrakt/v6';
import { ISøknadKontraktV8 } from '../typer/kontrakt/v8';
import { IKvittering } from '../typer/kvittering';
import { dataISøknadKontraktFormat } from '../utils/mappingTilKontrakt/søknad';
import { dataISøknadKontraktFormatV8 } from '../utils/mappingTilKontrakt/søknadV8';
import { sendInn } from '../utils/sendInnSkjema';

export const useSendInnSkjema = (): {
    sendInnSkjema: () => Promise<[boolean, ISøknadKontrakt]>;
    sendInnSkjemaV8: () => Promise<[boolean, ISøknadKontraktV8]>;
} => {
    const { axiosRequest, søknad, settInnsendingStatus, settSisteModellVersjon } = useApp();
    const { soknadApi } = Miljø();
    const [valgtSpråk] = useSprakContext();

    const sendInnSkjema = async (): Promise<[boolean, ISøknadKontrakt]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });
        const formatert = dataISøknadKontraktFormat(valgtSpråk, søknad);

        const res = await axiosRequest<IKvittering, ISøknadKontrakt>({
            url: `${soknadApi}/soknad/v6`,
            method: 'POST',
            withCredentials: true,
            data: formatert,
            headers: {
                [modellVersjonHeaderName]: modellVersjon,
            },
            rejectCallback: res => {
                const responseData = res.response?.data;
                if (responseData && erModellMismatchResponsRessurs(responseData)) {
                    settSisteModellVersjon(responseData.data.modellVersjon);
                }
            },
        });
        settInnsendingStatus(res);

        return [res.status === RessursStatus.SUKSESS, formatert];
    };

    const sendInnSkjemaV8 = async (): Promise<[boolean, ISøknadKontraktV8]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });

        const formatert: ISøknadKontraktV8 = dataISøknadKontraktFormatV8(valgtSpråk, søknad);

        const res = await sendInn<ISøknadKontraktV8>(
            formatert,
            axiosRequest,
            `${soknadApi}/soknad/v8`,
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
        sendInnSkjema,
        sendInnSkjemaV8,
    };
};
