import createUseContext from 'constate';

import { preferredAxios, loggFeil, håndterApiRessurs } from './axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Ressurs, ApiRessurs, byggTomRessurs, byggFeiletRessurs } from '@navikt/familie-typer';
import { useState, useEffect } from 'react';
import { Person } from '../typer/person';

const [AppProvider, useApp] = createUseContext(() => {
    const [personData, settPersonData] = useState(byggTomRessurs<Person>());

    useEffect(() => {
        axiosRequest<Person, Object>({
            url: '/api/personopplysning',
            method: 'POST',
            data: {
                withCredentials: true,
                ident: '12345678901',
            },
        })
            .then(ressurs => {
                settPersonData(ressurs);
            })
            .catch(() => settPersonData(byggFeiletRessurs('Henting av persondata feilet')));
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
        personData,
    };
});

export { AppProvider, useApp };
