import { useEffect, useState } from 'react';

import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import createUseContext from 'constate';

import {
    ApiRessurs,
    byggHenterRessurs,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '@navikt/familie-typer';

import { IKvittering } from '../typer/kvittering';
import { ISøkerFraPdl } from '../typer/person';
import { initialStateSøknad, ISøknad } from '../typer/søknad';
import { autentiseringsInterceptor, InnloggetStatus } from '../utils/autentisering';
import { håndterApiRessurs, loggFeil, preferredAxios } from './axios';

const [AppProvider, useApp] = createUseContext(() => {
    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<ISøkerFraPdl>()); // legacy
    const [ressurserSomLaster, settRessurserSomLaster] = useState<string[]>([]);
    const [innloggetStatus, settInnloggetStatus] = useState<InnloggetStatus>(
        InnloggetStatus.IKKE_VERIFISERT
    );
    const [søknad, settSøknad] = useState<ISøknad>(initialStateSøknad);
    const [innsendingStatus, settInnsendingStatus] = useState(byggTomRessurs<IKvittering>());
    const [sisteUtfylteStegIndex, settSisteUtfylteStegIndex] = useState<number>(-1);

    autentiseringsInterceptor();

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.IKKE_VERIFISERT) {
            verifiserAtBrukerErAutentisert(settInnloggetStatus);
        }
        if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
            settSluttbruker(byggHenterRessurs());

            axiosRequest<ISøkerFraPdl, void>({
                url: '/api/personopplysning',
                method: 'POST',
                withCredentials: true,
                påvirkerSystemLaster: true,
            }).then(ressurs => {
                settSluttbruker(ressurs); // legacy
                nullstillSøknadsobjekt(ressurs); // legacy

                ressurs.status === RessursStatus.SUKSESS &&
                    settSøknad({
                        ...søknad,
                        søker: {
                            ...søknad.søker,
                            navn: ressurs.data.navn,
                            statsborgerskap: ressurs.data.statsborgerskap,
                            barn: ressurs.data.barn,
                            ident: ressurs.data.ident,
                            adresse: ressurs.data.adresse,
                            sivilstand: ressurs.data.sivilstand,
                        },
                    });
            });
        }
    }, [innloggetStatus]);

    const axiosRequest = async <T, D>(
        config: AxiosRequestConfig & { data?: D; påvirkerSystemLaster?: boolean }
    ): Promise<Ressurs<T>> => {
        const ressursId = `${config.method}_${config.url}`;
        config.påvirkerSystemLaster && settRessurserSomLaster([...ressurserSomLaster, ressursId]);

        return preferredAxios
            .request(config)
            .then((response: AxiosResponse<ApiRessurs<T>>) => {
                const responsRessurs: ApiRessurs<T> = response.data;
                config.påvirkerSystemLaster && fjernRessursSomLaster(ressursId);

                return håndterApiRessurs(responsRessurs);
            })
            .catch((error: AxiosError) => {
                config.påvirkerSystemLaster && fjernRessursSomLaster(ressursId);
                loggFeil(error);

                const responsRessurs: ApiRessurs<T> = error.response?.data;
                return håndterApiRessurs(responsRessurs);
            });
    };

    const fjernRessursSomLaster = (ressursId: string) => {
        setTimeout(() => {
            settRessurserSomLaster((prevState: string[]) => {
                return prevState.filter((ressurs: string) => ressurs !== ressursId);
            });
        }, 300);
    };

    const systemetLaster = () => {
        return ressurserSomLaster.length > 0 || innloggetStatus === InnloggetStatus.IKKE_VERIFISERT;
    };

    const systemetFeiler = () => {
        return (
            innloggetStatus === InnloggetStatus.FEILET ||
            sluttbruker.status === RessursStatus.FEILET
        );
    };

    const systemetOK = () => {
        return (
            innloggetStatus === InnloggetStatus.AUTENTISERT &&
            sluttbruker.status === RessursStatus.SUKSESS
        );
    };

    const verifiserAtBrukerErAutentisert = (
        settInnloggetStatus: (innloggetStatus: InnloggetStatus) => void
    ) => {
        return axiosRequest({
            url: '/api/innlogget',
            method: 'GET',
            withCredentials: true,
            påvirkerSystemLaster: true,
        })
            .then(_ => {
                settInnloggetStatus(InnloggetStatus.AUTENTISERT);
            })
            .catch(_ => settInnloggetStatus(InnloggetStatus.FEILET));
    };

    const nullstillSøknadsobjekt = (ressurs: Ressurs<ISøkerFraPdl>) => {
        if (ressurs.status === RessursStatus.SUKSESS) {
            const søker = ressurs.data;
            settSøknad({
                ...initialStateSøknad,
                søker: {
                    ...initialStateSøknad.søker,
                    ...søker,
                },
            });
        }
    };

    return {
        axiosRequest,
        sluttbruker,
        søknad,
        settSøknad,
        systemetLaster,
        innloggetStatus,
        systemetFeiler,
        systemetOK,
        nullstillSøknadsobjekt,
        innsendingStatus,
        settInnsendingStatus,
        sisteUtfylteStegIndex,
        settSisteUtfylteStegIndex,
    };
});

export { AppProvider, useApp };
