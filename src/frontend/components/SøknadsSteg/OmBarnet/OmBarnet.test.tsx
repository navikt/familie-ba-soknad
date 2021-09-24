import React from 'react';

import { act, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import { AppNavigationProvider } from '../../../context/AppNavigationContext';
import { RoutesProvider } from '../../../context/RoutesContext';
import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    barnDataKeySpørsmålUtvidet,
    IBarnMedISøknad,
} from '../../../typer/person';
import {
    mekkGyldigSøknad,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import OmBarnet from './OmBarnet';

silenceConsoleErrors();

const jens = {
    navn: 'Jens',
    id: 'random-id-jens',
    ident: '12345678910',
    [barnDataKeySpørsmål.erFosterbarn]: { id: '1', svar: ESvar.NEI },
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: { id: '2', svar: ESvar.JA },
    [barnDataKeySpørsmål.institusjonsnavn]: { id: '3', svar: 'narvesen' },
    [barnDataKeySpørsmål.institusjonsadresse]: { id: '4', svar: 'narvesen' },
    [barnDataKeySpørsmål.institusjonspostnummer]: { id: '5', svar: '2030' },
    [barnDataKeySpørsmål.institusjonOppholdStartdato]: { id: '6', svar: '2020-08-08' },
    [barnDataKeySpørsmål.institusjonOppholdSluttdato]: {
        id: '7',
        svar: AlternativtSvarForInput.UKJENT,
    },
    [barnDataKeySpørsmål.oppholderSegIUtland]: { id: '8', svar: ESvar.JA },
    [barnDataKeySpørsmål.oppholdsland]: { id: '9', svar: 'AUS' },
    [barnDataKeySpørsmål.oppholdslandStartdato]: { id: '10', svar: '2020-08-08' },
    [barnDataKeySpørsmål.oppholdslandSluttdato]: { id: '11', svar: AlternativtSvarForInput.UKJENT },
    [barnDataKeySpørsmål.nårKomBarnTilNorgeDato]: { id: '12', svar: '2020-07-07' },
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: { id: '13', svar: ESvar.JA },
    [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: { id: '14', svar: ESvar.JA },
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: { id: '15', svar: ESvar.JA },
    [barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]: { id: '16', svar: 'AUS' },
    [barnDataKeySpørsmål.andreForelderNavn]: { id: '17', svar: AlternativtSvarForInput.UKJENT },
    [barnDataKeySpørsmål.andreForelderFnr]: { id: '18', svar: AlternativtSvarForInput.UKJENT },
    [barnDataKeySpørsmål.andreForelderFødselsdato]: {
        id: '19',
        svar: AlternativtSvarForInput.UKJENT,
    },
    [barnDataKeySpørsmål.andreForelderArbeidUtlandet]: { id: '20', svar: ESvar.JA },
    [barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand]: { id: '21', svar: 'AUS' },
    [barnDataKeySpørsmål.andreForelderPensjonUtland]: { id: '22', svar: ESvar.VET_IKKE },
    [barnDataKeySpørsmål.andreForelderPensjonHvilketLand]: { id: '23', svar: '' },
    [barnDataKeySpørsmål.borFastMedSøker]: { id: '24', svar: ESvar.NEI },
    [barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: { id: '25', svar: ESvar.NEI },
    [barnDataKeySpørsmål.søkerForTidsromStartdato]: {
        id: '26',
        svar: AlternativtSvarForInput.UKJENT,
    },
    [barnDataKeySpørsmål.søkerForTidsromSluttdato]: {
        id: '27',
        svar: AlternativtSvarForInput.UKJENT,
    },
    utvidet: {
        [barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder]: { id: 26, svar: ESvar.NEI },
        [barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato]: { id: 27, svar: ESvar.JA },
    },
};
const line = {
    navn: 'Line',
    id: 'random-id-line',
    ident: '12345678911',
    [barnDataKeySpørsmål.erFosterbarn]: { id: '', svar: ESvar.NEI },
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: { id: '', svar: ESvar.NEI },
    [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: { id: '', svar: ESvar.NEI },
    [barnDataKeySpørsmål.institusjonsnavn]: { id: '', svar: '' },
    [barnDataKeySpørsmål.institusjonsadresse]: { id: '', svar: '' },
    [barnDataKeySpørsmål.institusjonspostnummer]: { id: '', svar: '' },
    [barnDataKeySpørsmål.institusjonOppholdStartdato]: { id: '', svar: '' },
    [barnDataKeySpørsmål.institusjonOppholdSluttdato]: {
        id: '',
        svar: '',
    },
    [barnDataKeySpørsmål.oppholderSegIUtland]: { id: '8', svar: 'A' },
    [barnDataKeySpørsmål.oppholdsland]: { id: '9', svar: '' },
    [barnDataKeySpørsmål.oppholdslandStartdato]: { id: '10', svar: '' },
    [barnDataKeySpørsmål.oppholdslandSluttdato]: { id: '11', svar: '' },
    [barnDataKeySpørsmål.nårKomBarnTilNorgeDato]: { id: '12', svar: '' },
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: { id: '13', svar: null },
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: { id: '15', svar: ESvar.NEI },
    [barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]: { id: '16', svar: '' },
    [barnDataKeySpørsmål.andreForelderNavn]: { id: '17', svar: AlternativtSvarForInput.UKJENT },
    [barnDataKeySpørsmål.andreForelderFnr]: { id: '18', svar: AlternativtSvarForInput.UKJENT },
    [barnDataKeySpørsmål.andreForelderFødselsdato]: {
        id: '19',
        svar: AlternativtSvarForInput.UKJENT,
    },
    [barnDataKeySpørsmål.andreForelderArbeidUtlandet]: { id: '20', svar: ESvar.JA },
    [barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand]: { id: '21', svar: 'AUS' },
    [barnDataKeySpørsmål.andreForelderPensjonUtland]: { id: '22', svar: ESvar.VET_IKKE },
    [barnDataKeySpørsmål.andreForelderPensjonHvilketLand]: { id: '23', svar: '' },
    [barnDataKeySpørsmål.borFastMedSøker]: { id: '24', svar: ESvar.NEI },
    [barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: { id: '25', svar: ESvar.NEI },
    [barnDataKeySpørsmål.søkerForTidsromStartdato]: {
        id: '26',
        svar: AlternativtSvarForInput.UKJENT,
    },
    [barnDataKeySpørsmål.søkerForTidsromSluttdato]: {
        id: '27',
        svar: AlternativtSvarForInput.UKJENT,
    },
    utvidet: {
        [barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder]: { id: 26, svar: ESvar.NEI },
        [barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato]: { id: 27, svar: ESvar.JA },
    },
};

describe('OmBarnet', () => {
    test(`Kan rendre Om Barnet og alle tekster finnes i språkfil`, () => {
        mockHistory(['/om-barnet/barn-1']);
        spyOnUseApp({
            barnInkludertISøknaden: [jens],
            sisteUtfylteStegIndex: 4,
        });

        render(
            <TestProvidereMedEkteTekster>
                <OmBarnet barnetsId={'random-id-jens'} />
            </TestProvidereMedEkteTekster>
        );

        expect(console.error).toHaveBeenCalledTimes(0);
    });

    test(`Kan navigere mellom to barn`, () => {
        const { mockedHistoryArray } = mockHistory(['/om-barnet/barn-1']);
        spyOnUseApp({
            barnInkludertISøknaden: [jens, line],
            sisteUtfylteStegIndex: 4,
            dokumentasjon: [],
        });
        const { getByText } = render(
            <SprakProvider
                tekster={{ nb: { 'ombarnet.sidetittel': 'Om {navn}' } }}
                defaultLocale={LocaleType.nb}
            >
                <HttpProvider>
                    <AppNavigationProvider>
                        <RoutesProvider>
                            <OmBarnet barnetsId={'random-id-jens'} />
                        </RoutesProvider>
                    </AppNavigationProvider>
                </HttpProvider>
            </SprakProvider>
        );

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/om-barnet/barn-1');

        const jensTittel = getByText('Om JENS');
        expect(jensTittel).toBeInTheDocument();

        const gåVidere = getByText(/felles.navigasjon.gå-videre/);
        act(() => gåVidere.click());

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/om-barnet/barn-2');
    });

    test(`Kan navigere fra barn til oppsummering`, () => {
        const { mockedHistoryArray } = mockHistory(['/om-barnet/barn-1']);
        mockHistory(['/om-barnet/barn-1']);

        spyOnUseApp({
            barnInkludertISøknaden: [jens],
            sisteUtfylteStegIndex: 4,
            dokumentasjon: [],
        });

        const { getByText } = render(
            <SprakProvider
                tekster={{ nb: { 'ombarnet.sidetittel': 'Om {navn}' } }}
                defaultLocale={LocaleType.nb}
            >
                <HttpProvider>
                    <AppNavigationProvider>
                        <RoutesProvider>
                            <OmBarnet barnetsId={'random-id-jens'} />
                        </RoutesProvider>
                    </AppNavigationProvider>
                </HttpProvider>
            </SprakProvider>
        );

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/om-barnet/barn-1');

        const jensTittel = getByText('Om JENS');
        expect(jensTittel).toBeInTheDocument();

        const gåVidere = getByText(/felles.navigasjon.gå-videre/);
        act(() => gåVidere.click());

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/oppsummering');
    });

    test('Fødselnummer til andre forelder blir fjernet om man huker av ikke oppgi opplysninger om den', () => {
        mockHistory(['/om-barnet/barn-1']);

        spyOnUseApp({
            barnInkludertISøknaden: [
                {
                    ...jens,
                    [barnDataKeySpørsmål.andreForelderNavn]: { id: '17', svar: '' },
                    [barnDataKeySpørsmål.andreForelderFnr]: { id: '18', svar: '' },
                },
            ],
            sisteUtfylteStegIndex: 4,
            dokumentasjon: [],
        });

        const { getByLabelText, getByText, queryByText } = render(
            <SprakProvider
                tekster={{ nb: { 'ombarnet.sidetittel': 'Om {navn}' } }}
                defaultLocale={LocaleType.nb}
            >
                <HttpProvider>
                    <AppNavigationProvider>
                        <RoutesProvider>
                            <OmBarnet barnetsId={'random-id-jens'} />
                        </RoutesProvider>
                    </AppNavigationProvider>
                </HttpProvider>
            </SprakProvider>
        );

        const ikkeOppgiOpplysninger = getByLabelText(/ombarnet.andre-forelder.navn-ukjent.spm/);
        const andreForelderFnrLabel = getByText(/felles.fødsels-eller-dnummer.label/);

        expect(queryByText(/felles.fødselsdato.label/)).not.toBeInTheDocument();
        expect(andreForelderFnrLabel).toBeInTheDocument();
        act(() => ikkeOppgiOpplysninger.click());
        expect(andreForelderFnrLabel).not.toBeInTheDocument();
        expect(queryByText(/felles.fødselsdato.label/)).not.toBeInTheDocument();
    });

    test('Rendrer tidsrom hvis fosterbarn og bor fast med søker er satt', async () => {
        mockHistory(['/om-barnet/barn-1']);
        const fakeBarn = mockDeep<IBarnMedISøknad>({
            id: 'random-id',
            erFosterbarn: {
                svar: ESvar.JA,
            },
            borFastMedSøker: {
                svar: null,
            },
            søkerForTidsromStartdato: {
                svar: '',
            },
            søkerForTidsromSluttdato: {
                svar: '',
            },
            andreForelderNavn: { svar: '' },
            institusjonsnavn: { svar: '' },
            institusjonsadresse: { svar: '' },
            andreForelderFnr: { svar: '' },
        });

        const { erStegUtfyltFrafør } = spyOnUseApp({
            barnInkludertISøknaden: [fakeBarn],
        });
        erStegUtfyltFrafør.mockReturnValue(false);

        const { getByLabelText, getByText, queryByText } = render(
            <TestProvidere>
                <OmBarnet barnetsId={'random-id'} />
            </TestProvidere>
        );

        expect(queryByText(/ombarnet.søker-for-periode.spm/)).not.toBeInTheDocument();

        const jaKnapp = getByLabelText('felles.svaralternativ.ja');
        act(() => jaKnapp.click());

        expect(getByText(/ombarnet.søker-for-periode.spm/)).toBeInTheDocument();
    });

    test('Rendrer tidsrom hvis ikke fosterbarn og både bor fast med søker og avtale om delt bosted er satt', async () => {
        mockHistory(['/om-barnet/barn-1']);
        const fakeBarn = mockDeep<IBarnMedISøknad>({
            id: 'random-id',
            erFosterbarn: {
                svar: ESvar.NEI,
            },
            andreForelderNavn: {
                svar: AlternativtSvarForInput.UKJENT,
            },
            søkerForTidsromStartdato: {
                svar: '',
            },
            søkerForTidsromSluttdato: {
                svar: '',
            },
            institusjonsnavn: { svar: '' },
            institusjonsadresse: { svar: '' },
            andreForelderFnr: { svar: '' },
        });

        const { erStegUtfyltFrafør } = spyOnUseApp({
            barnInkludertISøknaden: [fakeBarn],
        });
        erStegUtfyltFrafør.mockReturnValue(false);

        const { queryByText, getAllByLabelText } = render(
            <TestProvidere>
                <OmBarnet barnetsId={'random-id'} />
            </TestProvidere>
        );

        /**
         * For en eller annen grunn hjelper det ikke å sette verdier på barnet her, seksjonen for om barnet bor fast med søker
         * dukker ikke opp, vi er nødt til å trykke oss igjennom spørsmålene med act for at vi skal komme frem.
         */

        const vetIkkeKnapper = getAllByLabelText(/felles.svaralternativ.vetikke/);
        act(() => vetIkkeKnapper.forEach(knapp => knapp.click()));

        const neiKnapper = getAllByLabelText(/felles.svaralternativ.nei/);
        // Dette endrer svarene vi hadde satt til vet_ikke, men utfallet er det samme så lenge vi ikke endrer til ja
        act(() => neiKnapper.forEach(knapp => knapp.click()));

        expect(queryByText(/ombarnet.søker-for-periode.spm/)).toBeInTheDocument();
    });

    test('Får opp feilmelding ved feil postnummer', async () => {
        mockHistory(['/om-barnet/barn-1']);

        //henter ut en gyldig søknad
        const søknadpostnummer = mekkGyldigSøknad();

        const barn: IBarnMedISøknad = søknadpostnummer.barnInkludertISøknaden[0];

        const endretBarn = {
            ...barn,

            institusjonspostnummer: {
                id: barnDataKeySpørsmål.institusjonspostnummer,
                svar: '12345678900',
            },
            oppholderSegIInstitusjon: {
                id: barnDataKeySpørsmål.oppholderSegIInstitusjon,
                svar: ESvar.JA,
            },
        };
        const oppdatertSøknad = { ...søknadpostnummer, barnInkludertISøknaden: [endretBarn] };
        const { erStegUtfyltFrafør } = spyOnUseApp(oppdatertSøknad);
        erStegUtfyltFrafør.mockReturnValue(false);

        const { queryByText } = render(
            <TestProvidere>
                <OmBarnet barnetsId={endretBarn.id} />
            </TestProvidere>
        );

        const gåVidereKnapper = queryByText(/felles.navigasjon.gå-videre/);
        expect(
            queryByText(/ombarnet.institusjon.postnummer.over-ti-tegn.feilmelding/)
        ).not.toBeInTheDocument();
        act(() => {
            gåVidereKnapper && gåVidereKnapper.click();
        });
        expect(
            queryByText(/ombarnet.institusjon.postnummer.over-ti-tegn.feilmelding/)
        ).toBeInTheDocument();
    });
});
