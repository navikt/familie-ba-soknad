import createUseContext from 'constate';

import { preferredAxios, loggFeil, håndterApiRessurs } from './axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import {
    Ressurs,
    ApiRessurs,
    byggTomRessurs,
    byggFeiletRessurs,
    byggHenterRessurs,
    RessursStatus,
} from '@navikt/familie-typer';
import { useState, useEffect } from 'react';
import { IPerson } from '../typer/person';
import { hentAlder } from '../utils/person';
import { autentiseringsInterceptor, InnloggetStatus } from '../utils/autentisering';
import { ESøknadstype, ISøknad } from '../typer/søknad';
import { formaterFnr } from '../utils/visning';

const initialState = {
    søknadstype: { label: 'Velg type søknad', verdi: ESøknadstype.IKKE_SATT },
    søker: { navn: { label: '', verdi: '' } },
    barn: [],
};

const [AppProvider, useApp] = createUseContext(() => {
    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<IPerson>());
    const [ressurserSomLaster, settRessurserSomLaster] = useState<string[]>([]);
    const [innloggetStatus, settInnloggetStatus] = useState<InnloggetStatus>(
        InnloggetStatus.IKKE_VERIFISERT
    );
    const [søknad, settSøknad] = useState<ISøknad>(initialState);

    autentiseringsInterceptor();

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.IKKE_VERIFISERT) {
            verifiserAtBrukerErAutentisert(settInnloggetStatus);
        }
        if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
            settSluttbruker(byggHenterRessurs());

            axiosRequest<IPerson, void>({
                url: '/api/personopplysning',
                method: 'POST',
                withCredentials: true,
                påvirkerSystemLaster: true,
            })
                .then(ressurs => {
                    settSluttbruker(ressurs);
                    if (ressurs.status === RessursStatus.SUKSESS) {
                        const søker = {
                            navn: { label: 'Ditt navn', verdi: ressurs.data.navn },
                        };
                        const barn = ressurs.data.barn.map(barn => {
                            return {
                                navn: { label: 'Barnets navn', verdi: barn.navn },
                                alder: { label: 'Alder', verdi: hentAlder(barn.fødselsdato) },
                                fødselsdato: { label: 'Fødselsdato', verdi: barn.fødselsdato },
                                ident: {
                                    label: 'Fødselsnummer',
                                    verdi: formaterFnr(barn.ident),
                                },
                                medISøknad: { label: 'Med i søknad', verdi: true },
                                borMedSøker: {
                                    label: 'Adresse',
                                    verdi: barn.borMedSøker
                                        ? 'Registrert på din adresse'
                                        : 'Ikke registrert på adressen din',
                                },
                            };
                        });
                        settSøknad({ ...søknad, søker: søker, barn: barn });
                    }
                })

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

    return {
        axiosRequest,
        sluttbruker,
        søknad,
        settSøknad,
        systemetLaster,
        innloggetStatus,
        systemetFeiler,
        systemetOK,
    };
});

export { AppProvider, useApp };
