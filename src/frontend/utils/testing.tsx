import React, { ReactNode } from 'react';

import * as history from 'history';
import { History } from 'history';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';

import norskeTekster from '../assets/lang/nb.json';
import {
    DinLivssituasjonSpørsmålId,
    SamboerSpørsmålId,
    TidligereSamboerSpørsmålId,
} from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { EøsBarnSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import * as appContext from '../context/AppContext';
import { AppProvider } from '../context/AppContext';
import { AppNavigationProvider } from '../context/AppNavigationContext';
import * as eøsContext from '../context/EøsContext';
import { EøsProvider } from '../context/EøsContext';
import * as featureToggleContext from '../context/FeatureToggleContext';
import { FeatureTogglesProvider } from '../context/FeatureToggleContext';
import { InnloggetProvider } from '../context/InnloggetContext';
import { LastRessurserProvider } from '../context/LastRessurserContext';
import * as pdlRequest from '../context/pdl';
import * as routesContext from '../context/RoutesContext';
import { getRoutes, RoutesProvider } from '../context/RoutesContext';
import { StegProvider } from '../context/StegContext';
import { andreForelderDataKeySpørsmål, barnDataKeySpørsmål } from '../typer/barn';
import { AlternativtSvarForInput } from '../typer/common';
import { EFeatureToggle } from '../typer/feature-toggles';
import { ESivilstand, ESøknadstype } from '../typer/kontrakt/generelle';
import { IKvittering } from '../typer/kvittering';
import { ISøker, ISøkerRespons } from '../typer/person';
import { initialStateSøknad, ISøknad } from '../typer/søknad';
import { Årsak } from '../typer/utvidet';
import { genererInitialBarnMedISøknad } from './barn';
import * as eøsUtils from './eøs';

jest.mock('../context/pdl');

export const spyOnUseApp = søknad => {
    jest.spyOn(pdlRequest, 'hentSluttbrukerFraPdl').mockImplementation(async () => ({
        status: RessursStatus.SUKSESS,
        data: mockDeep<ISøkerRespons>({ sivilstand: { type: ESivilstand.UGIFT }, ...søknad.søker }),
    }));
    const settSøknad = jest.fn();
    const erPåKvitteringsside = jest.fn().mockImplementation(() => false);
    const erStegUtfyltFrafør = jest.fn().mockImplementation(() => true);
    const settSisteUtfylteStegIndex = jest.fn();
    const innsendingStatus = mockDeep<Ressurs<IKvittering>>({
        status: RessursStatus.IKKE_HENTET,
    });
    const settInnsendingStatus = jest.fn();
    const axiosRequestMock = jest
        .fn()
        .mockImplementation(
            (): Promise<Ressurs<unknown>> =>
                Promise.resolve({ status: RessursStatus.SUKSESS, data: {} })
        );
    const erUtvidet = søknad.søknadstype === 'UTVIDET';
    const settNåværendeRoute = jest.fn();
    const mellomlagre = jest.fn();
    const sluttbruker = { status: RessursStatus.SUKSESS, data: { navn: '' } };

    søknad.barnInkludertISøknaden = søknad.barnInkludertISøknaden ?? [];
    søknad.erEøs = søknad.erEøs ?? false;
    søknad.søker = {
        ...mekkGyldigSøker(),
        ...søknad.søker,
    };

    const useAppMock = jest.fn().mockReturnValue({
        søknad,
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        settSøknad,
        sisteUtfylteStegIndex: 2,
        erPåKvitteringsside,
        innsendingStatus,
        settInnsendingStatus,
        axiosRequest: axiosRequestMock,
        erUtvidet,
        settNåværendeRoute,
        mellomlagre,
        sluttbruker,
        systemetLaster: jest.fn().mockReturnValue(false),
        systemetOK: () => jest.fn().mockReturnValue(true),
        systemetFeiler: jest.fn().mockReturnValue(false),
    });
    jest.spyOn(appContext, 'useApp').mockImplementation(useAppMock);

    return {
        useAppMock,
        settSøknad,
        erStegUtfyltFrafør,
        settSisteUtfylteStegIndex,
        erPåKvitteringsside,
        axiosRequestMock,
        søknad,
    };
};

export const mockEøs = (eøsSkruddAv = false, barnSomTriggerEøs = [], søkerTriggerEøs = false) => {
    // Prøvde å gjøre dette med __mocks__ uten hell, mocken ble ikke brukt av jest. Gjerne prøv igjen.
    const landSvarSomKanTriggeEøs = jest
        .spyOn(eøsUtils, 'landSvarSomKanTriggeEøs')
        .mockReturnValue([]);
    const jaNeiSvarTriggerEøs = jest.spyOn(eøsUtils, 'jaNeiSvarTriggerEøs').mockReturnValue(false);
    const erEøsLand = jest.fn();

    const useEøs = jest.spyOn(eøsContext, 'useEøs').mockImplementation(
        jest.fn().mockReturnValue({
            erEøsLand,
            eøsSkruddAv,
            barnSomTriggerEøs,
            settBarnSomTriggerEøs: jest.fn(),
            settSøkerTriggerEøs: jest.fn(),
            skalTriggeEøsForBarn: jest.fn().mockReturnValue(false),
            skalTriggeEøsForSøker: jest.fn().mockReturnValue(false),
            søkerTriggerEøs,
        })
    );
    return { landSvarSomKanTriggeEøs, jaNeiSvarTriggerEøs, useEøs, erEøsLand };
};

export const mockRoutes = () => {
    const useRoutes = jest.spyOn(routesContext, 'useRoutes').mockImplementation(
        jest.fn().mockReturnValue({
            routes: getRoutes(false),
            hentRouteObjektForRouteEnum: jest.fn(),
        })
    );
    return { useRoutes };
};

export const mockFeatureToggle = () => {
    const useFeatureToggle = jest
        .spyOn(featureToggleContext, 'useFeatureToggles')
        .mockImplementation(
            jest.fn().mockReturnValue({
                toggles: { [EFeatureToggle.EØS_KOMPLETT]: false },
            })
        );
    return { useFeatureToggle };
};

export const brukUseAppMedTomSøknadForRouting = () => spyOnUseApp({ barnInkludertISøknaden: [] });

/**
 * Åpen for norsk oversettelse av funksjonsnavn
 * Denne fjerner alle console errors fra jest-output. Ikke bruk før du veit at det kun er
 * oversettelsesfeil igjen. Mulig vi heller burde mocke noe i intl.
 */
export const silenceConsoleErrors = () => {
    return jest.spyOn(global.console, 'error').mockImplementation(() => {
        // Shut up about the missing translations;
    });
};

export const wrapMedProvidere = (
    // eslint-disable-next-line
    providerComponents: React.FC<any>[],
    children?: ReactNode,
    språkTekster?: Record<string, string>
) => {
    const [Første, ...resten] = providerComponents;
    const erSpråkprovider = Første === SprakProvider;
    return (
        <Første
            {...(erSpråkprovider
                ? { tekster: { [LocaleType.nb]: språkTekster }, defaultLocale: LocaleType.nb }
                : {})}
        >
            {resten.length ? wrapMedProvidere(resten, children) : children}
        </Første>
    );
};

const wrapMedDefaultProvidere = (children: ReactNode, språkTekster: Record<string, string>) =>
    wrapMedProvidere(
        [
            SprakProvider,
            HttpProvider,
            LastRessurserProvider,
            InnloggetProvider,
            FeatureTogglesProvider,
            AppProvider,
            EøsProvider,
            RoutesProvider,
            StegProvider,
            AppNavigationProvider,
        ],
        children,
        språkTekster
    );

export const wrapMedDefaultProvidereOgNorskeSpråktekster = (children: ReactNode) =>
    wrapMedDefaultProvidere(children, norskeTekster);

export const TestProvidere: React.FC<{ tekster?: Record<string, string> }> = ({
    tekster,
    children,
}) => wrapMedDefaultProvidere(children, tekster ?? {});

export const TestProvidereMedEkteTekster: React.FC = ({ children }) => (
    <TestProvidere tekster={norskeTekster}>{children}</TestProvidere>
);

export const mockHistory = (
    newHistory: string[]
): { mockedHistory: History; mockedHistoryArray: string[] } => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore denne har vi definert i __mocks__/history
    return history.__setHistory(newHistory);
};

export const mekkGyldigSøker = (): ISøker => {
    return {
        ...initialStateSøknad.søker,
        sivilstand: { type: ESivilstand.UGIFT },
        harSamboerNå: { id: DinLivssituasjonSpørsmålId.harSamboerNå, svar: ESvar.JA },
        utenlandsperioder: [],
        nåværendeSamboer: {
            navn: { id: SamboerSpørsmålId.nåværendeSamboerNavn, svar: 'Gunnar' },
            ident: {
                id: SamboerSpørsmålId.nåværendeSamboerFnr,
                svar: AlternativtSvarForInput.UKJENT,
            },
            fødselsdato: {
                id: SamboerSpørsmålId.nåværendeSamboerFødselsdato,
                svar: AlternativtSvarForInput.UKJENT,
            },
            samboerFraDato: {
                id: SamboerSpørsmålId.nåværendeSamboerFraDato,
                svar: '2021-08-11',
            },
        },
        borPåRegistrertAdresse: {
            id: OmDegSpørsmålId.borPåRegistrertAdresse,
            svar: ESvar.JA,
        },
        værtINorgeITolvMåneder: {
            id: OmDegSpørsmålId.værtINorgeITolvMåneder,
            svar: ESvar.JA,
        },
        planleggerÅBoINorgeTolvMnd: {
            id: OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd,
            svar: null,
        },
        erAsylsøker: {
            id: DinLivssituasjonSpørsmålId.erAsylsøker,
            svar: ESvar.NEI,
        },
        jobberPåBåt: {
            id: DinLivssituasjonSpørsmålId.jobberPåBåt,
            svar: ESvar.NEI,
        },
        mottarUtenlandspensjon: {
            id: DinLivssituasjonSpørsmålId.mottarUtenlandspensjon,
            svar: ESvar.NEI,
        },
    };
};

export const mekkGyldigSøknad = (): ISøknad => {
    return {
        ...initialStateSøknad,
        søknadstype: ESøknadstype.ORDINÆR,
        lestOgForståttBekreftelse: true,
        søker: mekkGyldigSøker(),
        erNoenAvBarnaFosterbarn: {
            id: OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
            svar: ESvar.NEI,
        },
        oppholderBarnSegIInstitusjon: {
            id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
            svar: ESvar.NEI,
        },
        erBarnAdoptertFraUtland: {
            id: OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland,
            svar: ESvar.NEI,
        },
        søktAsylForBarn: {
            id: OmBarnaDineSpørsmålId.søktAsylForBarn,
            svar: ESvar.NEI,
        },
        mottarBarnetrygdForBarnFraAnnetEøsland: {
            id: OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
            svar: ESvar.NEI,
        },
        barnOppholdtSegTolvMndSammenhengendeINorge: {
            id: OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge,
            svar: ESvar.JA,
        },
        barnInkludertISøknaden: [
            {
                ...genererInitialBarnMedISøknad({
                    id: 'random-id',
                    ident: '1234',
                    navn: 'Datter Dattersdottir',
                    adressebeskyttelse: false,
                    alder: undefined,
                    borMedSøker: true,
                }),
                andreForelder: {
                    andreUtbetalingsperioder: [],
                    arbeidsperioderNorge: [],
                    pensjonsperioderUtland: [],
                    arbeidsperioderUtland: [],
                    pensjonsperioderNorge: [],
                    [andreForelderDataKeySpørsmål.navn]: {
                        id: OmBarnetSpørsmålsId.andreForelderNavn,
                        svar: AlternativtSvarForInput.UKJENT,
                    },
                    [andreForelderDataKeySpørsmål.fnr]: {
                        id: OmBarnetSpørsmålsId.andreForelderFnr,
                        svar: AlternativtSvarForInput.UKJENT,
                    },
                    [andreForelderDataKeySpørsmål.fødselsdato]: {
                        id: OmBarnetSpørsmålsId.andreForelderFødselsdato,
                        svar: AlternativtSvarForInput.UKJENT,
                    },
                    [andreForelderDataKeySpørsmål.arbeidUtlandet]: {
                        id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.pensjonUtland]: {
                        id: OmBarnetSpørsmålsId.andreForelderPensjonUtland,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.pensjonNorge]: {
                        id: EøsBarnSpørsmålId.andreForelderPensjonNorge,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.andreUtbetalinger]: {
                        id: EøsBarnSpørsmålId.andreForelderAndreUtbetalinger,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]: {
                        id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand,
                        svar: '',
                    },
                    [andreForelderDataKeySpørsmål.pensjonHvilketLand]: {
                        id: OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand,
                        svar: '',
                    },
                    [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: {
                        id: OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted,
                        svar: ESvar.NEI,
                    },
                    utvidet: {
                        [andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]: {
                            id: OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder,
                            svar: ESvar.NEI,
                        },
                        [andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]: {
                            id: OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato,
                            svar: '',
                        },
                    },
                },
                [barnDataKeySpørsmål.borFastMedSøker]: {
                    id: OmBarnetSpørsmålsId.borFastMedSøker,
                    svar: ESvar.JA,
                },
                [barnDataKeySpørsmål.søkerForTidsrom]: {
                    id: OmBarnetSpørsmålsId.søkerForTidsromStartdato,
                    svar: ESvar.NEI,
                },
                [barnDataKeySpørsmål.søkerForTidsromStartdato]: {
                    id: OmBarnetSpørsmålsId.søkerForTidsromStartdato,
                    svar: AlternativtSvarForInput.UKJENT,
                },
                [barnDataKeySpørsmål.søkerForTidsromSluttdato]: {
                    id: OmBarnetSpørsmålsId.søkerForTidsromSluttdato,
                    svar: AlternativtSvarForInput.UKJENT,
                },
            },
        ],
    };
};

export const mekkGyldigUtvidetSøknad = (): ISøknad => {
    const base: ISøknad = mekkGyldigSøknad();
    return {
        ...base,
        søknadstype: ESøknadstype.UTVIDET,
        søker: {
            ...base.søker,
            utvidet: {
                spørsmål: {
                    årsak: { id: DinLivssituasjonSpørsmålId.årsak, svar: Årsak.SKILT },
                    separertEnkeSkilt: {
                        id: DinLivssituasjonSpørsmålId.separertEnkeSkilt,
                        svar: ESvar.JA,
                    },
                    separertEnkeSkiltUtland: {
                        id: DinLivssituasjonSpørsmålId.separertEnkeSkiltUtland,
                        svar: ESvar.NEI,
                    },
                    separertEnkeSkiltDato: {
                        id: DinLivssituasjonSpørsmålId.separertEnkeSkiltDato,
                        svar: '2021-09-09',
                    },
                },
                tidligereSamboere: [
                    {
                        navn: {
                            id: TidligereSamboerSpørsmålId.tidligereSamboerNavn,
                            svar: 'Donald',
                        },
                        ident: {
                            id: TidligereSamboerSpørsmålId.tidligereSamboerFnr,
                            svar: AlternativtSvarForInput.UKJENT,
                        },
                        fødselsdato: {
                            id: TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato,
                            svar: '2021-09-02',
                        },
                        samboerFraDato: {
                            id: TidligereSamboerSpørsmålId.tidligereSamboerFraDato,
                            svar: '2021-08-04',
                        },
                        samboerTilDato: {
                            id: TidligereSamboerSpørsmålId.tidligereSamboerTilDato,
                            svar: '2021-08-19',
                        },
                    },
                ],
            },
        },
        barnInkludertISøknaden: base.barnInkludertISøknaden.map(barn => ({
            ...barn,
            ...(barn.andreForelder && {
                andreForelder: {
                    ...barn.andreForelder,
                    utvidet: {
                        ...barn.andreForelder?.utvidet,
                        søkerHarBoddMedAndreForelder: {
                            id: OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder,
                            svar: ESvar.JA,
                        },
                        søkerFlyttetFraAndreForelderDato: {
                            id: OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato,
                            svar: AlternativtSvarForInput.UKJENT,
                        },
                    },
                },
            }),
        })),
    };
};
