import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';

import { RessursStatus } from '@navikt/familie-typer';

import { erModellMismatchResponsRessurs } from '../../shared-utils/modellversjon';
import { useAppContext } from '../context/AppContext';
import { useSpråkContext } from '../context/SpråkContext';
import { ISøknadKontrakt } from '../typer/kontrakt/kontrakt';
import { dataISøknadKontraktFormat } from '../utils/mappingTilKontrakt/søknad';
import { soknadApiProxyUrl } from '../utils/miljø';
import { sendInn } from '../utils/sendInnSkjema';

export const useSendInnSkjema = (): {
    sendInnSkjema: () => Promise<[boolean, ISøknadKontrakt]>;
} => {
    const {
        axiosRequest,
        søknad,
        settInnsendingStatus,
        settSisteModellVersjon,
        tekster,
        tilRestLocaleRecord,
        plainTekst,
    } = useAppContext();
    const { valgtLocale } = useSpråkContext();

    const sendInnSkjema = async (): Promise<[boolean, ISøknadKontrakt]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });
        const kontraktVersjon = 10;

        try {
            const formatert: ISøknadKontrakt = dataISøknadKontraktFormat(
                valgtLocale,
                søknad,
                tekster(),
                tilRestLocaleRecord,
                kontraktVersjon,
                plainTekst
            );

            const res = await sendInn<ISøknadKontrakt>(
                formatert,
                axiosRequest,
                `${soknadApiProxyUrl}/soknad/v${kontraktVersjon}`,
                (res: AxiosError) => {
                    const responseData = res.response?.data;
                    if (responseData && erModellMismatchResponsRessurs(responseData)) {
                        settSisteModellVersjon(responseData.data.modellVersjon);
                    } else {
                        //Denne skal feile mykt, med en custom feilmelding til brukeren. Kaster dermed ingen feil her.
                        Sentry.captureException(new Error('Klarte ikke sende inn søknaden', { cause: res.message }));
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
        sendInnSkjema: sendInnSkjema,
    };
};
