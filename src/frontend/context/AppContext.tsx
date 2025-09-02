import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { Alpha3Code, getName } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

import {
    byggFeiletRessurs,
    byggHenterRessurs,
    byggTomRessurs,
    hentDataFraRessurs,
    type Ressurs,
    RessursStatus,
} from '@navikt/familie-typer';

import Miljø, { BASE_PATH } from '../../shared-utils/Miljø';
import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { useDebounce } from '../hooks/useDebounce/useDebounce';
import { LocaleType } from '../typer/common';
import { IKontoinformasjon } from '../typer/kontoinformasjon';
import { ESivilstand, ESøknadstype, TilRestLocaleRecord } from '../typer/kontrakt/generelle';
import { IKvittering } from '../typer/kvittering';
import { IMellomlagretBarnetrygd } from '../typer/mellomlager';
import { ISøkerRespons } from '../typer/person';
import { RouteEnum } from '../typer/routes';
import {
    ESanityFlettefeltverdi,
    ESanitySteg,
    FlettefeltVerdier,
    PlainTekst,
} from '../typer/sanity/sanity';
import { ITekstinnhold } from '../typer/sanity/tekstInnhold';
import { initialStateSøknad, ISøknad } from '../typer/søknad';
import { InnloggetStatus } from '../utils/autentisering';
import { mapBarnResponsTilBarn } from '../utils/barn';
import { plainTekstHof } from '../utils/sanity';

import { preferredAxios } from './axios';
import { useInnloggetContext } from './InnloggetContext';
import { AxiosRequest, useLastRessurserContext } from './LastRessurserContext';
import { hentSluttbrukerFraPdl } from './pdl';
import { useSanityContext } from './SanityContext';
import { useSpråkContext } from './SpråkContext';

export interface AppContext {
    axiosRequest: AxiosRequest;
    sluttbruker: Ressurs<ISøkerRespons>;
    søknad: ISøknad;
    settSøknad: React.Dispatch<React.SetStateAction<ISøknad>>;
    nullstillSøknadsobjekt: () => void;
    innsendingStatus: Ressurs<IKvittering>;
    settInnsendingStatus: React.Dispatch<React.SetStateAction<Ressurs<IKvittering>>>;
    sisteUtfylteStegIndex: number;
    settSisteUtfylteStegIndex: React.Dispatch<React.SetStateAction<number>>;
    erStegUtfyltFrafør: (nåværendeStegIndex: number) => boolean;
    avbrytOgSlettSøknad: () => void;
    gåTilbakeTilStart: () => void;
    brukMellomlagretVerdi: () => void;
    mellomlagretVerdi: IMellomlagretBarnetrygd | undefined;
    fåttGyldigKvittering: boolean;
    settFåttGyldigKvittering: React.Dispatch<React.SetStateAction<boolean>>;
    erUtvidet: boolean;
    settNåværendeRoute: React.Dispatch<React.SetStateAction<RouteEnum | undefined>>;
    systemetFeiler: () => boolean;
    systemetOK: () => boolean;
    systemetLaster: () => boolean;
    mellomlagre: () => void;
    tvingKjøringAvDebouncedMellomlagre: () => void;
    modellVersjonOppdatert: boolean;
    settSisteModellVersjon: React.Dispatch<React.SetStateAction<number>>;
    eøsLand: Ressurs<Map<Alpha3Code, string>>;
    settEøsLand: React.Dispatch<React.SetStateAction<Ressurs<Map<Alpha3Code, string>>>>;
    tekster: () => ITekstinnhold;
    flettefeltTilTekst: (
        sanityFlettefelt: ESanityFlettefeltverdi,
        flettefelter?: FlettefeltVerdier,
        spesifikkLocale?: LocaleType
    ) => string;
    plainTekst: PlainTekst;
    tilRestLocaleRecord: TilRestLocaleRecord;
    kontoinformasjon: Ressurs<IKontoinformasjon>;
}

const AppContext = createContext<AppContext | undefined>(undefined);

export function AppProvider(props: PropsWithChildren) {
    const { valgtLocale } = useSpråkContext();
    const intl = useIntl();
    const { axiosRequest, lasterRessurser } = useLastRessurserContext();
    const { innloggetStatus } = useInnloggetContext();
    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<ISøkerRespons>());
    const [eøsLand, settEøsLand] = useState(byggTomRessurs<Map<Alpha3Code, string>>());
    const [kontoinformasjon, settKontoinformasjon] = useState(byggTomRessurs<IKontoinformasjon>());
    const [søknad, settSøknad] = useState<ISøknad>(initialStateSøknad());
    const [innsendingStatus, settInnsendingStatus] = useState(byggTomRessurs<IKvittering>());
    const [sisteUtfylteStegIndex, settSisteUtfylteStegIndex] = useState<number>(-1);
    const [mellomlagretVerdi, settMellomlagretVerdi] = useState<IMellomlagretBarnetrygd>();
    const [fåttGyldigKvittering, settFåttGyldigKvittering] = useState(false);
    const [nåværendeRoute, settNåværendeRoute] = useState<RouteEnum | undefined>(undefined);
    const { modellVersjon } = Miljø();
    const [sisteModellVersjon, settSisteModellVersjon] = useState(modellVersjon);
    const modellVersjonOppdatert = sisteModellVersjon > modellVersjon;

    const { teksterRessurs } = useSanityContext();

    useEffect(() => {
        if (nåværendeRoute === RouteEnum.Kvittering) {
            return;
        } else {
            axiosRequest<number, void>({
                url: `${BASE_PATH}modellversjon`,
            }).then(data =>
                settSisteModellVersjon(prevState => hentDataFraRessurs(data) ?? prevState)
            );
        }
    }, [nåværendeRoute]);

    useEffect(() => {
        if (!søknad.søker.triggetEøs) {
            settSøknad({
                ...søknad,
                søker: {
                    ...søknad.søker,
                    adresseISøkeperiode: {
                        ...søknad.søker.adresseISøkeperiode,
                        svar: '',
                    },
                },
            });
        }
    }, [søknad.søker.triggetEøs]);

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
            settSluttbruker(byggHenterRessurs());

            hentSluttbrukerFraPdl(axiosRequest).then(ressurs => {
                settSluttbruker(ressurs);

                hentOgSettMellomlagretData();
                hentOgSettKontoinformasjon();
                if (ressurs.status === RessursStatus.SUKSESS) {
                    settSøknad({
                        ...søknad,
                        søker: {
                            ...søknad.søker,
                            navn: ressurs.data.navn,
                            statsborgerskap: ressurs.data.statsborgerskap,
                            barn: mapBarnResponsTilBarn(ressurs.data.barn, intl),
                            ident: ressurs.data.ident,
                            adresse: ressurs.data.adresse,
                            sivilstand: ressurs.data.sivilstand,
                            adressebeskyttelse: ressurs.data.adressebeskyttelse,
                            utvidet: {
                                ...søknad.søker.utvidet,
                                spørsmål: {
                                    ...søknad.søker.utvidet.spørsmål,
                                    harSamboerNå: {
                                        ...søknad.søker.utvidet.spørsmål.harSamboerNå,
                                        id:
                                            ressurs.data.sivilstand.type === ESivilstand.GIFT
                                                ? DinLivssituasjonSpørsmålId.harSamboerNåGift
                                                : DinLivssituasjonSpørsmålId.harSamboerNå,
                                    },
                                },
                            },
                        },
                    });
                }
            });
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
            url: `${Miljø().dokumentProxyUrl}/soknad/barnetrygd`,
            method: 'post',
            withCredentials: true,
            påvirkerSystemLaster: false,
            data: barnetrygd,
        }).catch(() => {
            // do nothing
        });
        settMellomlagretVerdi(barnetrygd);
    };

    const {
        debouncedFunksjon: debouncedMellomlagre,
        tvingKjøringAvDebouncedFunksjon: tvingKjøringAvDebouncedMellomlagre,
    } = useDebounce(mellomlagre, 500);

    useEffect(() => {
        if (sisteUtfylteStegIndex > -1) {
            debouncedMellomlagre();
        }
    }, [nåværendeRoute, søknad.dokumentasjon]);

    const hentOgSettMellomlagretData = () => {
        preferredAxios
            .get(`${Miljø().dokumentProxyUrl}/soknad/barnetrygd`, {
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
            url: `${Miljø().dokumentProxyUrl}/soknad/barnetrygd`,
            method: 'delete',
            withCredentials: true,
            påvirkerSystemLaster: false,
        });
        settMellomlagretVerdi(undefined);
    };

    const hentOgSettKontoinformasjon = () => {
        preferredAxios
            .get(`${Miljø().soknadApiProxyUrl}/kontoregister/hent-kontonr`, {
                withCredentials: true,
            })
            .then((response: { data?: Ressurs<IKontoinformasjon> }) => {
                if (response.data) {
                    settKontoinformasjon(response.data);
                }
            })
            .catch(() => {
                settKontoinformasjon(byggFeiletRessurs('Request mot kontoregisteret feilet'));
            });
    };

    const nullstillSøknadsobjekt = () => {
        const søker = søknad.søker;
        const initialSøknad = initialStateSøknad();
        settSøknad({
            ...initialSøknad,
            søker: {
                ...initialSøknad.søker,
                ident: søker.ident,
                navn: søker.navn,
                barn: søker.barn,
                statsborgerskap: søker.statsborgerskap,
                adresse: søker.adresse,
                sivilstand: søker.sivilstand,
                adressebeskyttelse: søker.adressebeskyttelse,
                utvidet: {
                    ...søker.utvidet,
                    spørsmål: {
                        ...søker.utvidet.spørsmål,
                        årsak: {
                            id: DinLivssituasjonSpørsmålId.årsak,
                            svar: '',
                        },
                        separertEnkeSkilt: {
                            id: DinLivssituasjonSpørsmålId.separertEnkeSkilt,
                            svar: null,
                        },
                        harSamboerNå: {
                            id:
                                søker.sivilstand.type === ESivilstand.GIFT
                                    ? DinLivssituasjonSpørsmålId.harSamboerNåGift
                                    : DinLivssituasjonSpørsmålId.harSamboerNå,
                            svar: null,
                        },
                        hattAnnenSamboerForSøktPeriode: {
                            id: DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode,
                            svar: null,
                        },
                    },
                    tidligereSamboere: [],
                },
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

    const systemetFeiler = () => {
        return (
            sluttbruker.status === RessursStatus.FEILET ||
            eøsLand.status === RessursStatus.FEILET ||
            teksterRessurs.status === RessursStatus.FEILET
        );
    };

    const systemetOK = () => {
        return (
            innloggetStatus === InnloggetStatus.AUTENTISERT &&
            sluttbruker.status === RessursStatus.SUKSESS &&
            eøsLand.status === RessursStatus.SUKSESS &&
            teksterRessurs.status === RessursStatus.SUKSESS
        );
    };

    const erUtvidet = søknad.søknadstype === ESøknadstype.UTVIDET;

    const systemetLaster = (): boolean => {
        return lasterRessurser() || innloggetStatus === InnloggetStatus.IKKE_VERIFISERT;
    };

    const tekster = (): ITekstinnhold => {
        if (teksterRessurs.status === RessursStatus.SUKSESS) {
            return teksterRessurs.data;
        } else {
            throw new Error(`Søknaden har lastet uten tekster`);
        }
    };

    const flettefeltTilTekst = (
        sanityFlettefelt: ESanityFlettefeltverdi,
        flettefelter?: FlettefeltVerdier,
        spesifikkLocale?: LocaleType
    ): string => {
        const frittståendeOrd = tekster()[ESanitySteg.FELLES].frittståendeOrd;
        switch (sanityFlettefelt) {
            case ESanityFlettefeltverdi.DATO:
                if (!flettefelter?.dato) {
                    throw Error('Flettefeltet dato ikke sendt med');
                }
                return flettefelter.dato;
            case ESanityFlettefeltverdi.KLOKKESLETT:
                if (!flettefelter?.klokkeslett) {
                    throw Error('Flettefeltet klokkeslett ikke sendt med');
                }
                return flettefelter.klokkeslett;
            case ESanityFlettefeltverdi.ANTALL:
                if (!flettefelter?.antall) {
                    throw Error('Flettefeltet antall ikke sendt med');
                }
                return flettefelter.antall;
            case ESanityFlettefeltverdi.TOTAL_ANTALL:
                if (!flettefelter?.totalAntall) {
                    throw Error('Flettefeltet totalAntall ikke sendt med');
                }
                return flettefelter.totalAntall;
            case ESanityFlettefeltverdi.SØKER_NAVN:
                return søknad.søker.navn;
            case ESanityFlettefeltverdi.BARN_NAVN:
                if (!flettefelter?.barnetsNavn) {
                    throw Error('Flettefeltet barnetsNavn ikke sendt med');
                }
                return flettefelter.barnetsNavn;
            case ESanityFlettefeltverdi.LAND:
                if (!flettefelter?.land) {
                    throw Error('Flettefeltet land ikke sendt med');
                }
                return (
                    getName(flettefelter.land, spesifikkLocale ?? valgtLocale) ?? flettefelter.land
                );
            case ESanityFlettefeltverdi.YTELSE:
                return plainTekst(
                    tekster()[ESanitySteg.FELLES].frittståendeOrd.barnetrygd,
                    undefined,
                    spesifikkLocale ?? valgtLocale
                );
            case ESanityFlettefeltverdi.I_UTENFOR:
                return plainTekst(
                    flettefelter?.gjelderUtland ? frittståendeOrd.utenfor : frittståendeOrd.i,
                    undefined,
                    spesifikkLocale ?? valgtLocale
                );
            case ESanityFlettefeltverdi.YTELSE_BESTEMT_FORM:
                throw Error('Flettefeltet YTELSE_BESTEMT_FORM er ikke støttet enda');
            case ESanityFlettefeltverdi.UTLANDET_NORGE:
                return plainTekst(
                    flettefelter?.gjelderUtland ? frittståendeOrd.utlandet : frittståendeOrd.norge,
                    undefined,
                    spesifikkLocale ?? valgtLocale
                );
        }
    };

    const plainTekst = plainTekstHof(flettefeltTilTekst, valgtLocale);

    const tilRestLocaleRecord: TilRestLocaleRecord = (
        sanityTekst,
        flettefelter
    ): Record<LocaleType, string> => {
        return {
            [LocaleType.en]: plainTekst(sanityTekst, flettefelter, LocaleType.en),
            [LocaleType.nn]: plainTekst(sanityTekst, flettefelter, LocaleType.nn),
            [LocaleType.nb]: plainTekst(sanityTekst, flettefelter, LocaleType.nb),
        };
    };

    return (
        <AppContext.Provider
            value={{
                axiosRequest,
                sluttbruker,
                søknad,
                settSøknad,
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
                systemetFeiler,
                systemetOK,
                systemetLaster,
                mellomlagre,
                tvingKjøringAvDebouncedMellomlagre,
                modellVersjonOppdatert,
                settSisteModellVersjon,
                eøsLand,
                settEøsLand,
                tekster,
                flettefeltTilTekst,
                plainTekst,
                tilRestLocaleRecord,
                kontoinformasjon,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);

    if (context === undefined) {
        throw new Error('useAppContext må brukes innenfor AppProvider');
    }

    return context;
}
