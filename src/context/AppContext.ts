import createUseContext from 'constate';

import { preferredAxios, loggFeil, håndterApiRessurs } from './axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import {
    Ressurs,
    ApiRessurs,
    byggTomRessurs,
    byggFeiletRessurs,
    byggHenterRessurs,
} from '@navikt/familie-typer';
import { useState, useEffect } from 'react';
import { IPerson } from '../typer/person';
import { InnloggetStatus } from '../utils/autentisering';

interface IProps {
    innloggetStatus: InnloggetStatus;
}

export enum ESøknadstype {
    IKKE_SATT = 'IKKE_SATT',
    ORDINÆR = 'ORDINÆR',
    UTVIDET = 'UTVIDET',
    EØS = 'EØS',
}

interface ISøknad {
    søknadstype: ESøknadstype;
}

const [AppProvider, useApp] = createUseContext(({ innloggetStatus }: IProps) => {
    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<IPerson>());
    const [søknad, settSøknad] = useState<ISøknad>({
        søknadstype: ESøknadstype.IKKE_SATT,
    });

    console.log(sluttbruker);
    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
            settSluttbruker(byggHenterRessurs());

            axiosRequest<IPerson, { ident: string }>({
                url: '/api/personopplysning',
                method: 'POST',
                withCredentials: true,
                data: {
                    ident: '12345678901',
                },
            })
                .then(ressurs => {
                    settSluttbruker(ressurs);
                })
                .catch(() => settSluttbruker(byggFeiletRessurs('Henting av persondata feilet')));
        }
    }, [innloggetStatus]);

    const axiosRequest = async <T, D>(
        config: AxiosRequestConfig & { data?: D; påvirkerSystemLaster?: boolean }
    ): Promise<Ressurs<T>> => {
        return preferredAxios
            .request(config)
            .then((response: AxiosResponse<ApiRessurs<T>>) => {
                const responsRessurs: ApiRessurs<T> = response.data;

                return håndterApiRessurs(responsRessurs);
            })
            .catch((error: AxiosError) => {
                loggFeil(error);

                const responsRessurs: ApiRessurs<T> = error.response?.data;
                return håndterApiRessurs(responsRessurs);
            });
    };

    return {
        axiosRequest,
        sluttbruker,
        søknad,
        settSøknad,
    };
});

export { AppProvider, useApp };
