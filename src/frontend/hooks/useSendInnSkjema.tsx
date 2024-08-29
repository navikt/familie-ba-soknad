import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';

import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../../shared-utils/Miljø';
import { erModellMismatchResponsRessurs } from '../../shared-utils/modellversjon';
import { useApp } from '../context/AppContext';
import { useSpråk } from '../context/SpråkContext';
import { ISøknadKontraktV8 } from '../typer/kontrakt/v8';
import { dataISøknadKontraktFormatV8 } from '../utils/mappingTilKontrakt/søknadV8';
import { sendInn } from '../utils/sendInnSkjema';

export const useSendInnSkjema = (): {
    sendInnSkjemaV8: () => Promise<[boolean, ISøknadKontraktV8]>;
} => {
    const { axiosRequest, søknad, settInnsendingStatus, settSisteModellVersjon } = useApp();
    const { soknadApiProxyUrl } = Miljø();
    const { valgtLocale } = useSpråk();
    const sendInnSkjemaV8 = async (): Promise<[boolean, ISøknadKontraktV8]> => {
        try {
            settInnsendingStatus({ status: RessursStatus.HENTER });

            const formatert: ISøknadKontraktV8 = dataISøknadKontraktFormatV8(valgtLocale, søknad);

            const res = await sendInn<ISøknadKontraktV8>(
                formatert,
                axiosRequest,
                `${soknadApiProxyUrl}/soknad/v8`,
                (res: AxiosError) => {
                    const responseData = res.response?.data;
                    if (responseData && erModellMismatchResponsRessurs(responseData)) {
                        settSisteModellVersjon(responseData.data.modellVersjon);
                    } else {
                        //Denne skal feile mykt, med en custom feilmelding til brukeren. Kaster dermed ingen feil her.
                        Sentry.captureException(
                            new Error('Klarte ikke sende inn søknaden', { cause: res.message })
                        );
                    }
                }
            );

            settInnsendingStatus(res);

            return [res.status === RessursStatus.SUKSESS, formatert];
        } catch (error) {
            throw new Error('Søknaden feilet på innsending', { cause: error });
        }
    };

    return {
        sendInnSkjemaV8,
    };
};
