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
import { verifiserAtBrukerErAutentisert } from '../utils/autentisering';

import { autentiseringsInterceptor, InnloggetStatus } from '../utils/autentisering';

export enum ESøknadstype {
    IKKE_SATT = 'IKKE_SATT',
    ORDINÆR = 'ORDINÆR',
    UTVIDET = 'UTVIDET',
    EØS = 'EØS',
}

interface ITekstFelt {
    label: string;
    verdi: string;
}

interface ISøker {
    navn: ITekstFelt;
}

interface IBooleanFelt {
    label: string;
    verdi: boolean;
}

interface IBarn {
    navn: ITekstFelt;
    alder: ITekstFelt;
    fødselsdato: ITekstFelt;
    ident: ITekstFelt;
    borMedSøker: IBooleanFelt;
}

interface ISøknad {
    søknadstype: ITekstFelt;
    søker: ISøker;
    barn: IBarn[];
}

const initialState = {
    søknadstype: { label: 'Velg type søknad', verdi: ESøknadstype.IKKE_SATT },
    søker: { navn: { label: 'Ditt navn', verdi: 'Kis Kisesen' } },
    barn: [
        {
            navn: { label: 'Ditt navn', verdi: 'Kid Kisesen' },
            alder: { label: 'Alder', verdi: '2' },
            fødselsdato: { label: 'Fødselsdato', verdi: '2018-01-01' },
            ident: { label: 'Fødselsnummer(?)', verdi: '12345678910' },
            borMedSøker: { label: 'Bor barnet på din adresse?', verdi: true },
        },
    ],
};

const [AppProvider, useApp] = createUseContext(() => {
    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<IPerson>());
    const [ressurserSomLaster, settRessurserSomLaster] = useState<string[]>([]);
    const [innloggetStatus, settInnloggetStatus] = useState<InnloggetStatus>(
        InnloggetStatus.IKKE_VERIFISERT
    );
    const [søknad, settSøknad] = useState<ISøknad>(initialState);

    autentiseringsInterceptor();

    console.log(sluttbruker);
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
                })
                .catch(() => settSluttbruker(byggFeiletRessurs('Henting av persondata feilet')));
        }
        if (sluttbruker.status === RessursStatus.SUKSESS) {
            const søker = {
                navn: { label: 'Ditt navn', verdi: sluttbruker.data.navn },
            };
            settSøknad({ ...søknad, søker: søker });
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
                loggFeil(error);

                config.påvirkerSystemLaster && fjernRessursSomLaster(ressursId);

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

    return {
        axiosRequest,
        sluttbruker,
        søknad,
        settSøknad,
        systemetLaster,
        innloggetStatus,
        systemetFeiler,
    };
});

export { AppProvider, useApp };
