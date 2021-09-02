import { useIntl } from 'react-intl';

import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import Miljø from '../../../Miljø';
import { IKvittering } from '../../../typer/kvittering';
import { ISøknadKontrakt, ISøknadSpørsmål } from '../../../typer/søknad';
import { dataISøknadKontraktFormat } from '../../../utils/kontrakt/kontrakt';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SpørsmålMap = Record<string, ISøknadSpørsmål<any>>;

export const useSendInnSkjema = (): { sendInnSkjema: () => Promise<boolean> } => {
    const { axiosRequest, søknad, settInnsendingStatus } = useApp();
    const intl = useIntl();
    const { soknadApi } = Miljø();

    const sendInnSkjema = async () => {
        settInnsendingStatus({ status: RessursStatus.HENTER });
        const formatert = dataISøknadKontraktFormat(søknad, intl);

        return await axiosRequest<IKvittering, ISøknadKontrakt>({
            url: `${soknadApi}/soknad/v3`,
            method: 'POST',
            withCredentials: true,
            data: formatert,
        }).then(
            res => {
                settInnsendingStatus(res);
                return res.status === RessursStatus.SUKSESS;
            },
            () => {
                settInnsendingStatus({
                    status: RessursStatus.FEILET,
                    frontendFeilmelding: 'Kunne ikke sende inn søknaden',
                });
                return false;
            }
        );
    };

    return {
        sendInnSkjema,
    };
};
