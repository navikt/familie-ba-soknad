import createUseContext from 'constate';

import { preferredAxios, loggFeil, håndterApiRessurs } from './axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import {
    Ressurs,
    ApiRessurs,
    byggTomRessurs,
    byggFeiletRessurs,
    byggHenterRessurs,
} from '../typer/ressurs';
import { useState, useEffect } from 'react';
import { autentiseringsInterceptor } from '../utils/autentisering';

const [AppProvider, useApp] = createUseContext(() => {
    const [helseApi, settHelseApi] = useState(byggTomRessurs<string>());
    const [helseMottak, settHelseMottak] = useState(byggTomRessurs<string>());
    const [helsePdl, settHelsePdl] = useState(byggTomRessurs<string>());

    useEffect(() => {
        settHelseApi(byggHenterRessurs());
        settHelseMottak(byggHenterRessurs());
        settHelsePdl(byggHenterRessurs());

        axiosRequest<string, void>({
            url: '/api/helse/soknad-api',
            method: 'GET',
        })
            .then(ressurs => {
                settHelseApi(ressurs);
            })
            .catch(() => {
                settHelseApi(byggFeiletRessurs('Helse mot backend feilet'));
            });

        axiosRequest<string, void>({
            url: '/api/helse/mottak',
            method: 'GET',
        })
            .then(ressurs => {
                settHelseMottak(ressurs);
            })
            .catch(() => {
                settHelseMottak(byggFeiletRessurs('Helse mot mottak feilet'));
            });

        axiosRequest<string, void>({
            url: '/api/helse/pdl',
            method: 'GET',
        })
            .then(ressurs => {
                settHelsePdl(ressurs);
            })
            .catch(() => {
                settHelsePdl(byggFeiletRessurs('Helse mot pdl feilet'));
            });
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
        helseApi,
        helseMottak,
        helsePdl,
    };
});

export { AppProvider, useApp };
