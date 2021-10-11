import React, { ReactNode } from 'react';

import * as history from 'history';
import { History } from 'history';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';

import norskeTekster from '../assets/lang/nb.json';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import {
    DinLivssituasjonSpørsmålId,
    SamboerSpørsmålId,
    TidligereSamboerSpørsmålId,
} from '../components/SøknadsSteg/Utvidet-DinLivssituasjon/spørsmål';
import * as appContext from '../context/AppContext';
import { AppProvider } from '../context/AppContext';
import { AppNavigationProvider } from '../context/AppNavigationContext';
import * as eøsContext from '../context/EøsContext';
import { EøsProvider } from '../context/EøsContext';
import { InnloggetProvider } from '../context/InnloggetContext';
import { LastRessurserProvider } from '../context/LastRessurserContext';
import { RoutesProvider } from '../context/RoutesContext';
import { IKvittering } from '../typer/kvittering';
import { AlternativtSvarForInput, barnDataKeySpørsmål } from '../typer/person';
import { ESøknadstype, initialStateSøknad, ISøknad, Årsak } from '../typer/søknad';
import { genererInitialBarnMedISøknad } from './barn';
import * as eøsUtils from './eøs';

export const spyOnUseApp = søknad => {
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
    });
    jest.spyOn(appContext, 'useApp').mockImplementation(useAppMock);

    return {
        useAppMock,
        settSøknad,
        erStegUtfyltFrafør,
        settSisteUtfylteStegIndex,
        erPåKvitteringsside,
        axiosRequestMock,
    };
};

export const mockEøs = (eøsSkruddAv = false) => {
    // Prøvde å gjøre dette med __mocks__ uten hell, mocken ble ikke brukt av jest. Gjerne prøv igjen.
    const landSvarSomKanTriggeEøs = jest
        .spyOn(eøsUtils, 'landSvarSomKanTriggeEøs')
        .mockReturnValue([]);
    const jaNeiSvarTriggerEøs = jest.spyOn(eøsUtils, 'jaNeiSvarTriggerEøs').mockReturnValue(false);
    const erEøsLand = jest.fn();
    const useEøs = jest.spyOn(eøsContext, 'useEøs').mockReturnValue({
        erEøsLand,
        eøsSkruddAv,
    });
    return { landSvarSomKanTriggeEøs, jaNeiSvarTriggerEøs, useEøs, erEøsLand };
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
            AppProvider,
            EøsProvider,
            RoutesProvider,
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

export const mekkGyldigSøknad = (): ISøknad => {
    return {
        ...initialStateSøknad,
        søknadstype: ESøknadstype.ORDINÆR,
        lestOgForståttBekreftelse: true,
        søker: {
            ...initialStateSøknad.søker,
            harSamboerNå: { id: DinLivssituasjonSpørsmålId.harSamboerNå, svar: ESvar.JA },
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
            oppholderSegINorge: {
                id: OmDegSpørsmålId.oppholderSegINorge,
                svar: ESvar.JA,
            },
            værtINorgeITolvMåneder: {
                id: OmDegSpørsmålId.værtINorgeITolvMåneder,
                svar: ESvar.JA,
            },
            erAsylsøker: {
                id: OmDegSpørsmålId.erAsylsøker,
                svar: ESvar.NEI,
            },
            jobberPåBåt: {
                id: OmDegSpørsmålId.jobberPåBåt,
                svar: ESvar.NEI,
            },
            mottarUtenlandspensjon: {
                id: OmDegSpørsmålId.mottarUtenlandspensjon,
                svar: ESvar.NEI,
            },
        },
        erNoenAvBarnaFosterbarn: {
            id: OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
            svar: ESvar.NEI,
        },
        oppholderBarnSegIInstitusjon: {
            id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
            svar: ESvar.NEI,
        },
        erBarnAdoptertFraUtland: {
            id: OmBarnaDineSpørsmålId.oppholderBarnSegIUtland,
            svar: ESvar.NEI,
        },
        søktAsylForBarn: {
            id: OmBarnaDineSpørsmålId.søktAsylForBarn,
            svar: ESvar.NEI,
        },
        oppholderBarnSegIUtland: {
            id: OmBarnaDineSpørsmålId.oppholderBarnSegIUtland,
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
                [barnDataKeySpørsmål.andreForelderNavn]: {
                    id: OmBarnetSpørsmålsId.andreForelderNavn,
                    svar: AlternativtSvarForInput.UKJENT,
                },
                [barnDataKeySpørsmål.andreForelderFnr]: {
                    id: OmBarnetSpørsmålsId.andreForelderFnr,
                    svar: AlternativtSvarForInput.UKJENT,
                },
                [barnDataKeySpørsmål.andreForelderFødselsdato]: {
                    id: OmBarnetSpørsmålsId.andreForelderFødselsdato,
                    svar: AlternativtSvarForInput.UKJENT,
                },
                [barnDataKeySpørsmål.andreForelderArbeidUtlandet]: {
                    id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
                    svar: ESvar.NEI,
                },
                [barnDataKeySpørsmål.andreForelderPensjonUtland]: {
                    id: OmBarnetSpørsmålsId.andreForelderPensjonUtland,
                    svar: ESvar.NEI,
                },
                [barnDataKeySpørsmål.borFastMedSøker]: {
                    id: OmBarnetSpørsmålsId.borFastMedSøker,
                    svar: ESvar.JA,
                },
                [barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: {
                    id: OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted,
                    svar: ESvar.NEI,
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
            utvidet: {
                ...barn.utvidet,
                søkerHarBoddMedAndreForelder: {
                    id: OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder,
                    svar: ESvar.JA,
                },
                søkerFlyttetFraAndreForelderDato: {
                    id: OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato,
                    svar: AlternativtSvarForInput.UKJENT,
                },
            },
        })),
    };
};
