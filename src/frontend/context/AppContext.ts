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
import { IBarnNy, IPersonFraPdl } from '../typer/person';
import { initialStateSøknadNy, ISøknadNy } from '../typer/søknad';
import { autentiseringsInterceptor, InnloggetStatus } from '../utils/autentisering';
import { hentAlder } from '../utils/person';
import { formaterFnr } from '../utils/visning';
import { håndterApiRessurs, loggFeil, preferredAxios } from './axios';

const [AppProvider, useApp] = createUseContext(() => {
    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<IPersonFraPdl>()); // legacy
    const [ressurserSomLaster, settRessurserSomLaster] = useState<string[]>([]);
    const [innloggetStatus, settInnloggetStatus] = useState<InnloggetStatus>(
        InnloggetStatus.IKKE_VERIFISERT
    );
    const [søknad, settSøknad] = useState<ISøknadNy>(initialStateSøknadNy);
    const [innsendingStatus, settInnsendingStatus] = useState(byggTomRessurs<IKvittering>());
    const [utfyltSteg, settUtfyltSteg] = useState<number>(-1);

    autentiseringsInterceptor();

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.IKKE_VERIFISERT) {
            verifiserAtBrukerErAutentisert(settInnloggetStatus);
        }
        if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
            settSluttbruker(byggHenterRessurs());

            axiosRequest<IPersonFraPdl, void>({
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

    const nullstillSøknadsobjekt = (ressurs: Ressurs<IPersonFraPdl>) => {
        if (ressurs.status === RessursStatus.SUKSESS) {
            const søker = ressurs.data;
            const barn = ressurs.data.barn.map(
                (barn): IBarnNy => {
                    return {
                        navn: barn.navn,
                        alder: hentAlder(barn.fødselsdato),
                        fødselsdato: barn.fødselsdato,
                        ident: formaterFnr(barn.ident),
                        borMedSøker: barn.borMedSøker,
                        spørsmål: [],
                    };
                }
            );
            settSøknad({
                ...initialStateSøknadNy,
                søker: {
                    ...søker,
                    kontakttelefon: '',
                    spørsmål: [],
                },
                barn,
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
        utfyltSteg,
        settUtfyltSteg,
    };
});

export { AppProvider, useApp };
