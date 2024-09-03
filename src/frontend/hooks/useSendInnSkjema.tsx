import { AxiosError } from 'axios';

import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../../shared-utils/Miljø';
import { erModellMismatchResponsRessurs } from '../../shared-utils/modellversjon';
import { useApp } from '../context/AppContext';
import { useFeatureToggles } from '../context/FeatureToggleContext';
import { useSpråk } from '../context/SpråkContext';
import { ISøknadKontrakt } from '../typer/kontrakt/kontrakt';
import { dataISøknadKontraktFormat } from '../utils/mappingTilKontrakt/søknad';
import { sendInn } from '../utils/sendInnSkjema';

export const useSendInnSkjema = (): {
    sendInnSkjema: () => Promise<[boolean, ISøknadKontrakt]>;
} => {
    const { axiosRequest, søknad, settInnsendingStatus, settSisteModellVersjon } = useApp();
    const { soknadApiProxyUrl } = Miljø();
    const { valgtLocale } = useSpråk();
    const { tekster, tilRestLocaleRecord } = useApp();
    const sendInnSkjema = async (): Promise<[boolean, ISøknadKontrakt]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });

        const { toggles } = useFeatureToggles();

        const kontraktVersjon = toggles.BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD ? 9 : 8;

        const formatert: ISøknadKontrakt = dataISøknadKontraktFormat(
            valgtLocale,
            søknad,
            tekster(),
            tilRestLocaleRecord,
            kontraktVersjon
        );

        const res = await sendInn<ISøknadKontrakt>(
            formatert,
            axiosRequest,
            `${soknadApiProxyUrl}/soknad/v${kontraktVersjon}`,
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
        sendInnSkjema: sendInnSkjema,
    };
};
