import { useState } from 'react';

import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import createUseContext from 'constate';

import { type ApiRessurs, type Ressurs, RessursStatus } from '@navikt/familie-typer';

import { hentUid } from '../utils/barn';

import { håndterApiRessurs, loggFeil, preferredAxios } from './axios';

export type AxiosRequest = <T, D>(
    config: AxiosRequestConfig & {
        data?: D;
        påvirkerSystemLaster?: boolean;
        rejectCallback?: (res: AxiosError) => void;
    }
) => Promise<Ressurs<T>>;

const [LastRessurserProvider, useLastRessurserContext] = createUseContext(() => {
    const [ressurserSomLaster, settRessurserSomLaster] = useState<string[]>([]);

    const axiosRequest: AxiosRequest = async <T, D>(
        config: AxiosRequestConfig & {
            data?: D;
            påvirkerSystemLaster?: boolean;
            rejectCallback?: (res: AxiosError) => void;
        }
    ): Promise<Ressurs<T>> => {
        const ressursId = `${config.method}_${config.url}`;
        if (config.påvirkerSystemLaster) {
            settRessurserSomLaster([...ressurserSomLaster, ressursId]);
        }

        return preferredAxios
            .request(config)
            .then((response: AxiosResponse<ApiRessurs<T>>) => {
                const responsRessurs: ApiRessurs<T> = response.data;
                if (config.påvirkerSystemLaster) {
                    fjernRessursSomLaster(ressursId);
                }

                return håndterApiRessurs(responsRessurs);
            })
            .catch((error: AxiosError<ApiRessurs<T>>) => {
                if (config.påvirkerSystemLaster) {
                    fjernRessursSomLaster(ressursId);
                }
                if (config.rejectCallback) {
                    config.rejectCallback(error);
                }
                loggFeil(error);
                return error.response?.data
                    ? håndterApiRessurs(error.response.data)
                    : {
                          frontendFeilmelding: 'En feil har oppstått!',
                          status: RessursStatus.FEILET,
                      };
            });
    };

    const fjernRessursSomLaster = (ressursId: string) => {
        setTimeout(() => {
            settRessurserSomLaster((prevState: string[]) => {
                return prevState.filter((ressurs: string) => ressurs !== ressursId);
            });
        }, 300);
    };

    const wrapMedSystemetLaster = async <T>(callback: () => T | Promise<T>): Promise<T> => {
        const nyGeneriskRessurs = hentUid();
        settRessurserSomLaster(prevState => [...prevState, nyGeneriskRessurs]);
        try {
            return await callback();
        } finally {
            fjernRessursSomLaster(nyGeneriskRessurs);
        }
    };

    const lasterRessurser = (): boolean => ressurserSomLaster.length > 0;

    return {
        axiosRequest,
        wrapMedSystemetLaster,
        lasterRessurser,
        ressurserSomLaster,
        settRessurserSomLaster,
        fjernRessursSomLaster,
    };
});

export { LastRessurserProvider, useLastRessurserContext };
