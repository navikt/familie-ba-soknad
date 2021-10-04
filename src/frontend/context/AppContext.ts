import { useEffect, useState } from 'react';

import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import createUseContext from 'constate';

import { useSprakContext } from '@navikt/familie-sprakvelger';
import {
    ApiRessurs,
    byggHenterRessurs,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { IKvittering } from '../typer/kvittering';
import { IMellomlagretBarnetrygd } from '../typer/mellomlager';
import { ISøkerRespons } from '../typer/person';
import { ESøknadstype, initialStateSøknad, ISøknad } from '../typer/søknad';
import { autentiseringsInterceptor, InnloggetStatus } from '../utils/autentisering';
import { hentUid, mapBarnResponsTilBarn } from '../utils/barn';
import { håndterApiRessurs, loggFeil, preferredAxios } from './axios';
import { RouteEnum } from './RoutesContext';

const [AppProvider, useApp] = createUseContext(() => {
    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<ISøkerRespons>()); // legacy
    const [ressurserSomLaster, settRessurserSomLaster] = useState<string[]>([]);
    const [innloggetStatus, settInnloggetStatus] = useState<InnloggetStatus>(
        InnloggetStatus.IKKE_VERIFISERT
    );
    const [søknad, settSøknad] = useState<ISøknad>(initialStateSøknad);
    const [innsendingStatus, settInnsendingStatus] = useState(byggTomRessurs<IKvittering>());
    const [sisteUtfylteStegIndex, settSisteUtfylteStegIndex] = useState<number>(-1);
    const [mellomlagretVerdi, settMellomlagretVerdi] = useState<IMellomlagretBarnetrygd>();
    const [valgtLocale] = useSprakContext();
    const [fåttGyldigKvittering, settFåttGyldigKvittering] = useState(false);
    const [nåværendeRoute, settNåværendeRoute] = useState<RouteEnum | undefined>(undefined);
    const { soknadApi } = Miljø();
    const [alleLand, settAlleLand] = useState<Ressurs<Map<string, string>>>(byggTomRessurs());
    const [eosLand, settEosLand] = useState<Ressurs<Map<string, string>>>(byggTomRessurs());

    autentiseringsInterceptor();

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.IKKE_VERIFISERT) {
            verifiserAtBrukerErAutentisert(settInnloggetStatus);
        }
        if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
            settSluttbruker(byggHenterRessurs());

            Promise.all([
                axiosRequest<ISøkerRespons, void>({
                    url: `${soknadApi}/personopplysning`,
                    method: 'POST',
                    withCredentials: true,
                    påvirkerSystemLaster: true,
                }).then(ressurs => {
                    settSluttbruker(ressurs);

                    hentOgSettMellomlagretData();
                    ressurs.status === RessursStatus.SUKSESS &&
                        settSøknad({
                            ...søknad,
                            søker: {
                                ...søknad.søker,
                                navn: ressurs.data.navn,
                                statsborgerskap: ressurs.data.statsborgerskap,
                                barn: mapBarnResponsTilBarn(ressurs.data.barn),
                                ident: ressurs.data.ident,
                                adresse: ressurs.data.adresse,
                                sivilstand: ressurs.data.sivilstand,
                                adressebeskyttelse: ressurs.data.adressebeskyttelse,
                            },
                        });
                }),
                axiosRequest<Map<string, string>, void>({
                    url: `${soknadApi}/kodeverk/alle-land`,
                    method: 'GET',
                    withCredentials: true,
                    påvirkerSystemLaster: true,
                }).then(settAlleLand),
                axiosRequest<Map<string, string>, void>({
                    url: `${soknadApi}/kodeverk/eos-land`,
                    method: 'GET',
                    withCredentials: true,
                    påvirkerSystemLaster: true,
                }).then(settEosLand),
            ]);
        }
    }, [innloggetStatus]);

    const mellomlagre = () => {
        const barnetrygd: IMellomlagretBarnetrygd = {
            søknad: søknad,
            modellVersjon: Miljø().modellVersjon,
            sisteUtfylteStegIndex: sisteUtfylteStegIndex,
            locale: valgtLocale,
        };
        axiosRequest<IMellomlagretBarnetrygd, IMellomlagretBarnetrygd>({
            url: Miljø().mellomlagerUrl,
            method: 'post',
            withCredentials: true,
            påvirkerSystemLaster: false,
            data: barnetrygd,
        }).catch(() => {
            // do nothing
        });
        settMellomlagretVerdi(barnetrygd);
    };

    useEffect(() => {
        if (sisteUtfylteStegIndex > 0 && nåværendeRoute !== RouteEnum.Dokumentasjon) {
            mellomlagre();
        }
    }, [søknad, sisteUtfylteStegIndex, nåværendeRoute]);

    const hentOgSettMellomlagretData = () => {
        preferredAxios
            .get(Miljø().mellomlagerUrl, {
                withCredentials: true,
            })
            .then((response: { data?: IMellomlagretBarnetrygd }) => {
                if (response.data) {
                    settMellomlagretVerdi(response.data);
                }
            })
            .catch(() => {
                // Do nothing
            });
    };

    const brukMellomlagretVerdi = () => {
        if (mellomlagretVerdi) {
            settSøknad(mellomlagretVerdi.søknad);
            settSisteUtfylteStegIndex(mellomlagretVerdi.sisteUtfylteStegIndex);
        }
    };

    const nullstillMellomlagretVerdi = () => {
        axiosRequest<void, void>({
            url: Miljø().mellomlagerUrl,
            method: 'delete',
            withCredentials: true,
            påvirkerSystemLaster: false,
        });
        settMellomlagretVerdi(undefined);
    };

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
                return håndterApiRessurs(responsRessurs ?? { status: RessursStatus.FEILET });
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

    const systemetLaster = () => {
        return ressurserSomLaster.length > 0 || innloggetStatus === InnloggetStatus.IKKE_VERIFISERT;
    };

    const systemetFeiler = () => {
        return sluttbruker.status === RessursStatus.FEILET;
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
            url: `${soknadApi}/innlogget`,
            method: 'GET',
            params: { søknadstype: søknad.søknadstype },
            withCredentials: true,
            påvirkerSystemLaster: true,
        })
            .then(ressurs => {
                if (ressurs.status === RessursStatus.SUKSESS) {
                    settInnloggetStatus(InnloggetStatus.AUTENTISERT);
                } else {
                    settInnloggetStatus(InnloggetStatus.FEILET);
                }
            })
            .catch(_ => {
                settInnloggetStatus(InnloggetStatus.FEILET);
            });
    };

    const nullstillSøknadsobjekt = () => {
        settSøknad({
            ...initialStateSøknad,
            søknadstype: søknad.søknadstype,
            søker: {
                ...initialStateSøknad.søker,
                ident: søknad.søker.ident,
                navn: søknad.søker.navn,
                barn: søknad.søker.barn,
                statsborgerskap: søknad.søker.statsborgerskap,
                adresse: søknad.søker.adresse,
                sivilstand: søknad.søker.sivilstand,
                adressebeskyttelse: søknad.søker.adressebeskyttelse,
            },
        });
    };

    const erStegUtfyltFrafør = (nåværendeStegIndex: number) =>
        sisteUtfylteStegIndex >= nåværendeStegIndex;

    const avbrytOgSlettSøknad = () => {
        nullstillSøknadsobjekt();
        nullstillMellomlagretVerdi();
        settSisteUtfylteStegIndex(-1);
    };

    const gåTilbakeTilStart = () => {
        nullstillSøknadsobjekt();
        settSisteUtfylteStegIndex(-1);
    };

    const erUtvidet = søknad.søknadstype === ESøknadstype.UTVIDET;

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
        erStegUtfyltFrafør,
        avbrytOgSlettSøknad,
        gåTilbakeTilStart,
        brukMellomlagretVerdi,
        mellomlagretVerdi,
        fåttGyldigKvittering,
        settFåttGyldigKvittering,
        erUtvidet,
        settNåværendeRoute,
        wrapMedSystemetLaster,
        alleLand,
        eosLand,
    };
});

export { AppProvider, useApp };
