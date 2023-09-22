import React, { ReactNode } from 'react';

import { mockDeep } from 'jest-mock-extended';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';

import norskeTekster from '../assets/lang/nb.json' assert { type: 'json' };
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
import { ESivilstand, ESøknadstype, Slektsforhold } from '../typer/kontrakt/generelle';
import { IKvittering } from '../typer/kvittering';
import { ISøker, ISøkerRespons } from '../typer/person';
import { initialStateSøknad, ISøknad } from '../typer/søknad';
import { Årsak } from '../typer/utvidet';

import { genererInitialBarnMedISøknad } from './barn';

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
    søknad.dokumentasjon = søknad.dokumentasjon ?? [];

    const settEøsLand = jest.fn();
    const eøsLand = { status: RessursStatus.SUKSESS, data: ['BEL', 'AFG', 'NLD', 'NOR'] };

    const useAppMock = jest.fn().mockReturnValue({
        søknad,
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        settSøknad,
        sisteUtfylteStegIndex: søknad.sisteUtfylteStegIndex || 2,
        erPåKvitteringsside,
        innsendingStatus,
        settInnsendingStatus,
        axiosRequest: axiosRequestMock,
        erUtvidet,
        settNåværendeRoute,
        mellomlagre,
        sluttbruker,
        settEøsLand,
        eøsLand,
        systemetLaster: jest.fn().mockReturnValue(false),
        systemetOK: () => jest.fn().mockReturnValue(true),
        systemetFeiler: jest.fn().mockReturnValue(false),
        fåttGyldigKvittering: søknad.fåttGyldigKvittering === true,
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

export const mockEøs = (barnSomTriggerEøs = [], søkerTriggerEøs = false) => {
    const erEøsLand = jest.fn();

    const useEøs = jest.spyOn(eøsContext, 'useEøs').mockImplementation(
        jest.fn().mockReturnValue({
            erEøsLand,
            barnSomTriggerEøs,
            settBarnSomTriggerEøs: jest.fn(),
            settSøkerTriggerEøs: jest.fn(),
            skalTriggeEøsForBarn: jest.fn().mockReturnValue(false),
            skalTriggeEøsForSøker: jest.fn().mockReturnValue(false),
            søkerTriggerEøs,
        })
    );
    return { useEøs, erEøsLand };
};

export const mockRoutes = () => {
    const useRoutes = jest.spyOn(routesContext, 'useRoutes').mockImplementation(
        jest.fn().mockReturnValue({
            routes: getRoutes(),
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
                // toggles: { [EFeatureToggle.EXAMPLE]: false },
            })
        );
    return { useFeatureToggle };
};

/**
 * Åpen for norsk oversettelse av funksjonsnavn
 * Denne fjerner alle console errors fra jest-output. Ikke bruk før du veit at det kun er
 * oversettelsesfeil igjen. Mulig vi heller burde mocke noe i intl.
 */
export const silenceConsoleErrors = () => {
    jest.spyOn(console, 'error');
    jest.spyOn(global.console, 'error').mockImplementation(() => {
        // Shut up about the missing translations;
    });
};

export const wrapMedProvidere = (
    // eslint-disable-next-line
    providerComponents: React.FC<any>[],
    mocketNettleserHistorikk: string[],
    children?: ReactNode,
    språkTekster?: Record<string, string>
) => {
    const [Første, ...resten] = providerComponents;
    const erSpråkprovider = Første === SprakProvider;
    const erMemoryRouter = Første === MemoryRouter;

    return (
        <Første
            {...(erSpråkprovider
                ? {
                      tekster: { [LocaleType.nb]: språkTekster },
                      defaultLocale: LocaleType.nb,
                      locale: LocaleType.nb,
                  }
                : {})}
            {...(erMemoryRouter ? { initialEntries: mocketNettleserHistorikk } : {})}
        >
            {resten.length
                ? wrapMedProvidere(resten, mocketNettleserHistorikk, children)
                : children}
        </Første>
    );
};

const wrapMedDefaultProvidere = (
    children: ReactNode,
    språkTekster: Record<string, string>,
    mocketNettleserHistorikk: string[]
) =>
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
            MemoryRouter,
            StegProvider,
            AppNavigationProvider,
        ],
        mocketNettleserHistorikk,
        children,
        språkTekster
    );

export const TestProvidere: React.FC<{
    tekster?: Record<string, string>;
    mocketNettleserHistorikk?: string[];
    children?: ReactNode;
}> = ({ tekster, mocketNettleserHistorikk = ['/'], children }) =>
    wrapMedDefaultProvidere(children, tekster ?? {}, mocketNettleserHistorikk);

export const TestProvidereMedEkteTekster: React.FC<{
    mocketNettleserHistorikk?: string[];
    children?: ReactNode;
}> = ({ mocketNettleserHistorikk, children }) => (
    <TestProvidere
        tekster={norskeTekster}
        children={children}
        mocketNettleserHistorikk={mocketNettleserHistorikk}
    />
);

export const LesUtLocation = () => {
    const location = useLocation();
    return <pre data-testid="location">{JSON.stringify(location)}</pre>;
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
        arbeidIUtlandet: {
            id: DinLivssituasjonSpørsmålId.arbeidIUtlandet,
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
                    alder: null,
                    borMedSøker: true,
                }),
                andreForelder: {
                    kanIkkeGiOpplysninger: {
                        id: OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger,
                        svar: ESvar.NEI,
                    },
                    adresse: {
                        id: EøsBarnSpørsmålId.andreForelderAdresse,
                        svar: 'Heisannveien 15',
                    },
                    andreUtbetalingsperioder: [],
                    arbeidsperioderNorge: [],
                    pensjonsperioderUtland: [],
                    arbeidsperioderUtland: [],
                    pensjonsperioderNorge: [],
                    idNummer: [],
                    eøsBarnetrygdsperioder: [],
                    [andreForelderDataKeySpørsmål.barnetrygdFraEøs]: {
                        id: EøsBarnSpørsmålId.andreForelderBarnetrygd,
                        svar: ESvar.JA,
                    },
                    [andreForelderDataKeySpørsmål.navn]: {
                        id: OmBarnetSpørsmålsId.andreForelderNavn,
                        svar: 'Andre forelder navn',
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
                    [andreForelderDataKeySpørsmål.arbeidNorge]: {
                        id: EøsBarnSpørsmålId.andreForelderArbeidNorge,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.andreUtbetalinger]: {
                        id: EøsBarnSpørsmålId.andreForelderAndreUtbetalinger,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: {
                        id: OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: {
                        id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadFraAnnetEøsLand,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.pågåendeSøknadHvilketLand]: {
                        id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadHvilketLand,
                        svar: '',
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
                omsorgsperson: null,
                [barnDataKeySpørsmål.borFastMedSøker]: {
                    id: OmBarnetSpørsmålsId.borFastMedSøker,
                    svar: ESvar.JA,
                },
                [barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd]: {
                    id: OmBarnetSpørsmålsId.mottarEllerMottokEøsBarnetrygd,
                    svar: ESvar.NEI,
                },
                eøsBarnetrygdsperioder: [],
                [barnDataKeySpørsmål.adresse]: {
                    id: EøsBarnSpørsmålId.barnetsAdresse,
                    svar: '',
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
            ...(barn.omsorgsperson && {
                omsorgsperson: {
                    navn: {
                        id: EøsBarnSpørsmålId.omsorgspersonNavn,
                        svar: 'Testnavn',
                    },
                    slektsforhold: {
                        id: EøsBarnSpørsmålId.omsorgspersonSlektsforhold,
                        svar: Slektsforhold.ANNEN_RELASJON,
                    },
                    slektsforholdSpesifisering: {
                        id: EøsBarnSpørsmålId.omsorgspersonSlektsforholdSpesifisering,
                        svar: 'Tantebarnebarn',
                    },
                    idNummer: {
                        id: EøsBarnSpørsmålId.omsorgspersonIdNummer,
                        svar: '12345',
                    },
                    idNummerVetIkke: {
                        id: EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke,
                        svar: ESvar.NEI,
                    },
                    adresse: {
                        id: EøsBarnSpørsmålId.omsorgspersonAdresse,
                        svar: 'Osloveien 123',
                    },
                    arbeidsperioderUtland: [],
                    arbeidUtland: {
                        id: EøsBarnSpørsmålId.omsorgspersonArbeidUtland,
                        svar: ESvar.NEI,
                    },
                    arbeidsperioderNorge: [],
                    arbeidNorge: {
                        id: EøsBarnSpørsmålId.omsorgspersonArbeidNorge,
                        svar: ESvar.NEI,
                    },
                    pensjonsperioderUtland: [],
                    pensjonUtland: {
                        id: EøsBarnSpørsmålId.omsorgspersonPensjonUtland,
                        svar: ESvar.NEI,
                    },
                    pensjonsperioderNorge: [],
                    pensjonNorge: {
                        id: EøsBarnSpørsmålId.omsorgspersonPensjonNorge,
                        svar: ESvar.NEI,
                    },
                    andreUtbetalingsperioder: [],
                    andreUtbetalinger: {
                        id: EøsBarnSpørsmålId.omsorgspersonAndreUtbetalinger,
                        svar: ESvar.NEI,
                    },
                    pågåendeSøknadFraAnnetEøsLand: {
                        id: EøsBarnSpørsmålId.omsorgspersonPågåendeSøknadFraAnnetEøsLand,
                        svar: ESvar.NEI,
                    },
                    pågåendeSøknadHvilketLand: {
                        id: EøsBarnSpørsmålId.omsorgspersonPågåendeSøknadHvilketLand,
                        svar: '',
                    },
                    eøsBarnetrygdsperioder: [],
                    barnetrygdFraEøs: {
                        id: EøsBarnSpørsmålId.omsorgspersonBarnetrygd,
                        svar: ESvar.NEI,
                    },
                },
            }),
        })),
    };
};
