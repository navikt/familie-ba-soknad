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

const [AppProvider, useApp] = createUseContext(() => {
    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<IPerson>());

    console.log(sluttbruker);

    useEffect(() => {
        settSluttbruker(byggHenterRessurs());
        axiosRequest<IPerson, Object>({
            url: '/api/personopplysning',
            method: 'POST',
            data: {
                withCredentials: true,
                ident: '12345678901',
            },
        })
            .then(ressurs => {
                settSluttbruker(ressurs);
            })
            .catch(() => settSluttbruker(byggFeiletRessurs('Henting av persondata feilet')));
    }, []);

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
    };
});

export { AppProvider, useApp };
