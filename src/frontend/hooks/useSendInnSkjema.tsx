import { IntlShape, useIntl } from 'react-intl';

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
import { ISøknadKontraktV7 } from '../typer/kontrakt/v7';
import { IKvittering } from '../typer/kvittering';
import { dataISøknadKontraktFormat } from '../utils/mappingTilKontrakt/søknad';
import { dataISøknadKontraktFormatV7 } from '../utils/mappingTilKontrakt/søknadV7';
import { sendInn } from '../utils/sendInnSkjema';

export const useSendInnSkjema = (): {
    sendInnSkjema: () => Promise<[boolean, ISøknadKontrakt]>;
    sendInnSkjemaV7: () => Promise<[boolean, ISøknadKontraktV7]>;
} => {
    const { axiosRequest, søknad, settInnsendingStatus, settSisteModellVersjon } = useApp();
    const { soknadApi } = Miljø();
    const [valgtSpråk] = useSprakContext();
    const intl: IntlShape = useIntl();

    const sendInnSkjema = async (): Promise<[boolean, ISøknadKontrakt]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });
        const formatert = dataISøknadKontraktFormat(intl, valgtSpråk, søknad);

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

    const sendInnSkjemaV7 = async (): Promise<[boolean, ISøknadKontraktV7]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });

        const formatert: ISøknadKontraktV7 = dataISøknadKontraktFormatV7(intl, valgtSpråk, søknad);

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
        sendInnSkjema,
        sendInnSkjemaV7,
    };
};
