import React from 'react';

import { act, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
    omsorgspersonDataKeySpørsmål,
} from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { Slektsforhold } from '../../../typer/kontrakt/barn';
import {
    mekkGyldigSøknad,
    mockEøs,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import OmBarnet from './OmBarnet';
import { OmBarnetSpørsmålsId } from './spørsmål';

silenceConsoleErrors();

const jens = {
    navn: 'Jens',
    id: 'random-id-jens',
    ident: '12345678910',
    utenlandsperioder: [],
    idNummer: [],
    eøsBarnetrygdsperioder: [],
    [barnDataKeySpørsmål.erFosterbarn]: { id: '1', svar: ESvar.NEI },
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: { id: '2', svar: ESvar.JA },
    [barnDataKeySpørsmål.institusjonIUtland]: { id: '21', svar: ESvar.NEI },
    [barnDataKeySpørsmål.institusjonsnavn]: { id: '3', svar: 'narvesen' },
    [barnDataKeySpørsmål.institusjonsadresse]: { id: '4', svar: 'narvesen' },
    [barnDataKeySpørsmål.institusjonspostnummer]: { id: '5', svar: '2030' },
    [barnDataKeySpørsmål.institusjonOppholdStartdato]: { id: '6', svar: '2020-08-08' },
    [barnDataKeySpørsmål.institusjonOppholdSluttdato]: {
        id: '7',
        svar: AlternativtSvarForInput.UKJENT,
    },
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: { id: '13', svar: ESvar.JA },
    [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: { id: '14', svar: ESvar.NEI },
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: { id: '15', svar: ESvar.JA },
    [barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]: { id: '16', svar: 'AUS' },
    [barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd]: {
        id: '166',
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.borFastMedSøker]: { id: '24', svar: ESvar.NEI },
    [barnDataKeySpørsmål.søkerForTidsrom]: { id: '255', svar: ESvar.JA },
    [barnDataKeySpørsmål.søkerForTidsromStartdato]: {
        id: '26',
        svar: '2021-09-02',
    },
    [barnDataKeySpørsmål.søkerForTidsromSluttdato]: {
        id: '27',
        svar: '2021-09-03',
    },
    [barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId]: { id: '281', svar: null },
    [barnDataKeySpørsmål.andreForelderErDød]: { id: '28', svar: ESvar.NEI },
    [barnDataKeySpørsmål.borMedAndreForelder]: { id: '29', svar: ESvar.NEI },
    andreForelder: {
        [andreForelderDataKeySpørsmål.navn]: {
            id: '17',
            svar: AlternativtSvarForInput.UKJENT,
        },
        [andreForelderDataKeySpørsmål.fnr]: {
            id: '18',
            svar: AlternativtSvarForInput.UKJENT,
        },
        [andreForelderDataKeySpørsmål.fødselsdato]: {
            id: '19',
            svar: AlternativtSvarForInput.UKJENT,
        },
        [andreForelderDataKeySpørsmål.arbeidUtlandet]: {
            id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
            svar: ESvar.JA,
        },
        [andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]: {
            id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand,
            svar: 'AUS',
        },
        [andreForelderDataKeySpørsmål.pensjonUtland]: {
            id: OmBarnetSpørsmålsId.andreForelderPensjonUtland,
            svar: ESvar.VET_IKKE,
        },
        [andreForelderDataKeySpørsmål.pensjonHvilketLand]: {
            id: OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand,
            svar: '',
        },
        [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: { id: '25', svar: ESvar.NEI },
        utvidet: {
            [andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]: {
                id: 26,
                svar: ESvar.NEI,
            },
            [andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]: {
                id: 27,
                svar: ESvar.JA,
            },
        },
    },
    omsorgsperson: {
        [omsorgspersonDataKeySpørsmål.omsorgspersonNavn]: {
            id: 33,
            svar: 'Test omsorgspersonen',
        },
        [omsorgspersonDataKeySpørsmål.omsorgspersonSlektsforhold]: {
            id: 29,
            svar: Slektsforhold.ANNEN_RELASJON,
        },
        [omsorgspersonDataKeySpørsmål.omsorgpersonSlektsforholdSpesifisering]: {
            id: 30,
            svar: 'Søskenbarn',
        },
        [omsorgspersonDataKeySpørsmål.omsorgspersonIdNummer]: {
            id: 31,
            svar: '12345678',
        },
        [omsorgspersonDataKeySpørsmål.omsorgspersonAdresse]: {
            id: 32,
            svar: 'Oslogata 1',
        },
    },
};
const line = {
    navn: 'Line',
    id: 'random-id-line',
    ident: '12345678911',
    utenlandsperioder: [],
    idNummer: [],
    eøsBarnetrygdsperioder: [],
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
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: { id: '13', svar: null },
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: { id: '15', svar: ESvar.NEI },
    [barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]: { id: '16', svar: '' },
    [barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd]: {
        id: '166',
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.borFastMedSøker]: { id: '24', svar: ESvar.NEI },
    [barnDataKeySpørsmål.søkerForTidsrom]: { id: '255', svar: ESvar.JA },
    [barnDataKeySpørsmål.søkerForTidsromStartdato]: {
        id: '26',
        svar: '2021-09-03',
    },
    [barnDataKeySpørsmål.søkerForTidsromSluttdato]: {
        id: '27',
        svar: '',
    },
    [barnDataKeySpørsmål.andreForelderErDød]: { id: '28', svar: ESvar.NEI },
    [barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId]: {
        id: '281',
        svar: AlternativtSvarForInput.ANNEN_FORELDER,
    },
    [barnDataKeySpørsmål.borMedAndreForelder]: { id: '29', svar: ESvar.NEI },
    andreForelder: {
        [andreForelderDataKeySpørsmål.navn]: {
            id: '17',
            svar: AlternativtSvarForInput.UKJENT,
        },
        [andreForelderDataKeySpørsmål.fnr]: {
            id: '18',
            svar: AlternativtSvarForInput.UKJENT,
        },
        [andreForelderDataKeySpørsmål.fødselsdato]: {
            id: '19',
            svar: AlternativtSvarForInput.UKJENT,
        },
        [andreForelderDataKeySpørsmål.arbeidUtlandet]: {
            id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
            svar: ESvar.JA,
        },
        [andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]: {
            id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand,
            svar: 'AUS',
        },
        [andreForelderDataKeySpørsmål.pensjonUtland]: {
            id: OmBarnetSpørsmålsId.andreForelderPensjonUtland,
            svar: ESvar.VET_IKKE,
        },
        [andreForelderDataKeySpørsmål.pensjonHvilketLand]: {
            id: OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand,
            svar: '',
        },
        [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: { id: '25', svar: ESvar.NEI },
        utvidet: {
            [andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]: {
                id: 26,
                svar: ESvar.NEI,
            },
            [andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]: {
                id: 27,
                svar: ESvar.JA,
            },
        },
    },
    omsorgsperson: {
        [omsorgspersonDataKeySpørsmål.omsorgspersonNavn]: {
            id: 33,
            svar: 'Test omsorgspersonen',
        },
        [omsorgspersonDataKeySpørsmål.omsorgspersonSlektsforhold]: {
            id: 29,
            svar: Slektsforhold.ANNEN_RELASJON,
        },
        [omsorgspersonDataKeySpørsmål.omsorgpersonSlektsforholdSpesifisering]: {
            id: 30,
            svar: 'Søskenbarn',
        },
        [omsorgspersonDataKeySpørsmål.omsorgspersonIdNummer]: {
            id: 31,
            svar: '12345678',
        },
        [omsorgspersonDataKeySpørsmål.omsorgspersonAdresse]: {
            id: 32,
            svar: 'Oslogata 1',
        },
    },
};

describe('OmBarnet', () => {
    beforeEach(() => {
        mockEøs();
    });

    test(`Kan rendre Om Barnet og alle tekster finnes i språkfil`, async () => {
        mockHistory(['/om-barnet/barn-1']);
        spyOnUseApp({
            barnInkludertISøknaden: [jens],
            sisteUtfylteStegIndex: 4,
        });

        await act(async () => {
            render(
                <TestProvidereMedEkteTekster>
                    <OmBarnet barnetsId={'random-id-jens'} />
                </TestProvidereMedEkteTekster>
            );
        });

        expect(console.error).toHaveBeenCalledTimes(0);
    });

    test(`Kan navigere mellom to barn`, async () => {
        const { mockedHistoryArray } = mockHistory(['/om-barnet/barn-1']);
        spyOnUseApp({
            barnInkludertISøknaden: [jens, line],
            sisteUtfylteStegIndex: 4,
            dokumentasjon: [],
        });
        const { findByText } = render(
            <TestProvidere tekster={{ 'ombarnet.sidetittel': 'Om {navn}' }}>
                <OmBarnet barnetsId={'random-id-jens'} />
            </TestProvidere>
        );

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/om-barnet/barn-1');

        const jensTittel = await findByText('Om JENS');
        expect(jensTittel).toBeInTheDocument();

        const gåVidere = await findByText(/felles.navigasjon.gå-videre/);
        act(() => gåVidere.click());

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/om-barnet/barn-2');
    });

    test(`Kan navigere fra barn til oppsummering`, async () => {
        const { mockedHistoryArray } = mockHistory(['/om-barnet/barn-1']);
        mockHistory(['/om-barnet/barn-1']);

        spyOnUseApp({
            barnInkludertISøknaden: [jens],
            sisteUtfylteStegIndex: 4,
            dokumentasjon: [],
        });

        const { findByText } = render(
            <TestProvidere tekster={{ 'ombarnet.sidetittel': 'Om {navn}' }}>
                <OmBarnet barnetsId={'random-id-jens'} />
            </TestProvidere>
        );

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/om-barnet/barn-1');

        const jensTittel = await findByText('Om JENS');
        expect(jensTittel).toBeInTheDocument();

        const gåVidere = await findByText(/felles.navigasjon.gå-videre/);
        act(() => gåVidere.click());

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/oppsummering');
    });

    test('Fødselnummer til andre forelder blir fjernet om man huker av ikke oppgi opplysninger om den', async () => {
        mockHistory(['/om-barnet/barn-1']);

        spyOnUseApp({
            barnInkludertISøknaden: [
                {
                    ...jens,
                    andreForelder: {
                        ...jens.andreForelder,
                        [andreForelderDataKeySpørsmål.navn]: { id: '17', svar: '' },
                        [andreForelderDataKeySpørsmål.fnr]: { id: '18', svar: '' },
                    },
                },
            ],
            sisteUtfylteStegIndex: 4,
            dokumentasjon: [],
        });

        const { findByLabelText, findByText, queryByText } = render(
            <TestProvidere tekster={{ 'ombarnet.sidetittel': 'Om {navn}' }}>
                <OmBarnet barnetsId={'random-id-jens'} />
            </TestProvidere>
        );

        const ikkeOppgiOpplysninger = await findByLabelText(
            /ombarnet.andre-forelder.navn-ukjent.spm/
        );
        const andreForelderFnrLabel = await findByText(/felles.fødsels-eller-dnummer.label/);

        expect(queryByText(/felles.fødselsdato.label/)).not.toBeInTheDocument();
        expect(andreForelderFnrLabel).toBeInTheDocument();
        act(() => ikkeOppgiOpplysninger.click());
        expect(andreForelderFnrLabel).not.toBeInTheDocument();
        expect(queryByText(/felles.fødselsdato.label/)).not.toBeInTheDocument();
    });

    test('Rendrer tidsrom hvis bor fast med søker er satt', async () => {
        mockHistory(['/om-barnet/barn-1']);
        const fakeBarn = mockDeep<IBarnMedISøknad>({
            id: 'random-id',
            borFastMedSøker: {
                svar: null,
            },
            søkerForTidsrom: {
                svar: ESvar.JA,
            },
            søkerForTidsromStartdato: {
                svar: '',
            },
            søkerForTidsromSluttdato: {
                svar: '',
            },
            andreForelder: null,
            institusjonsnavn: { svar: '' },
            institusjonsadresse: { svar: '' },
            utenlandsperioder: [],
        });

        const { erStegUtfyltFrafør } = spyOnUseApp({
            barnInkludertISøknaden: [fakeBarn],
        });
        erStegUtfyltFrafør.mockReturnValue(false);

        const { findByLabelText, findByText, queryByText } = render(
            <TestProvidere>
                <OmBarnet barnetsId={'random-id'} />
            </TestProvidere>
        );

        expect(queryByText(/ombarnet.søker-for-periode.spm/)).not.toBeInTheDocument();

        const jaKnapp = await findByLabelText('felles.svaralternativ.ja');
        act(() => jaKnapp.click());

        expect(await findByText(/ombarnet.søker-for-periode.spm/)).toBeInTheDocument();
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

        const { queryByText, findAllByText } = render(
            <TestProvidere>
                <OmBarnet barnetsId={endretBarn.id} />
            </TestProvidere>
        );

        const gåVidereKnapper = queryByText(/felles.navigasjon.gå-videre/);
        expect(
            queryByText(/ombarnet.institusjon.postnummer.format.feilmelding/)
        ).not.toBeInTheDocument();

        act(() => {
            gåVidereKnapper && gåVidereKnapper.click();
        });
        const feilmelding = await findAllByText(
            /ombarnet.institusjon.postnummer.format.feilmelding/
        );
        expect(feilmelding).toHaveLength(2);
    });
});
