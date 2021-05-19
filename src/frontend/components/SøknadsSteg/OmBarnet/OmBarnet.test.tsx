import React from 'react';

import { act, render } from '@testing-library/react';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import { RoutesProvider } from '../../../context/RoutesContext';
import { AlternativtSvarForInput, barnDataKeySpørsmål } from '../../../typer/person';
import { mockHistory, silenceConsoleErrors, spyOnUseApp } from '../../../utils/testing';
import OmBarnet from './OmBarnet';

jest.mock('../../../context/AppContext');

const mockedHistory = mockHistory(['/om-barnet/barn-1']);

silenceConsoleErrors();

const jens = {
    navn: 'Jens',
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
};
const line = {
    navn: 'Line',
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
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: { id: '13', svar: undefined },
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
};

test(`Kan rendre Om Barnet Utfyllende`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [jens],
        sisteUtfylteStegIndex: 4,
    });

    render(
        <SprakProvider tekster={{}} defaultLocale={LocaleType.nb}>
            <HttpProvider>
                <RoutesProvider>
                    <OmBarnet barnetsIdent={'12345678910'} />
                </RoutesProvider>
            </HttpProvider>
        </SprakProvider>
    );
});

test(`Kan navigere mellom to barn`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [jens, line],
        sisteUtfylteStegIndex: 4,
    });
    const { getByText } = render(
        <SprakProvider
            tekster={{ nb: { 'ombarnet.sidetittel': 'Om {navn}' } }}
            defaultLocale={LocaleType.nb}
        >
            <HttpProvider>
                <RoutesProvider>
                    <OmBarnet barnetsIdent={'12345678910'} />
                </RoutesProvider>
            </HttpProvider>
        </SprakProvider>
    );

    expect(mockedHistory[mockedHistory.length - 1]).toEqual('/om-barnet/barn-1');

    const jensTittel = getByText('Om Jens');
    expect(jensTittel).toBeInTheDocument();

    const gåVidere = getByText(/felles.navigasjon.gå-videre/);
    act(() => gåVidere.click());

    expect(mockedHistory[mockedHistory.length - 1]).toEqual('/om-barnet/barn-2');
});

test(`Kan navigere fra barn til oppsummering`, () => {
    mockHistory(['/om-barnet/barn-1']);

    spyOnUseApp({
        barnInkludertISøknaden: [jens],
        sisteUtfylteStegIndex: 4,
    });

    const { getByText } = render(
        <SprakProvider
            tekster={{ nb: { 'ombarnet.sidetittel': 'Om {navn}' } }}
            defaultLocale={LocaleType.nb}
        >
            <HttpProvider>
                <RoutesProvider>
                    <OmBarnet barnetsIdent={'12345678910'} />
                </RoutesProvider>
            </HttpProvider>
        </SprakProvider>
    );

    expect(mockedHistory[mockedHistory.length - 1]).toEqual('/om-barnet/barn-1');

    const jensTittel = getByText('Om Jens');
    expect(jensTittel).toBeInTheDocument();

    const gåVidere = getByText(/felles.navigasjon.gå-videre/);
    act(() => gåVidere.click());

    expect(mockedHistory[mockedHistory.length - 1]).toEqual('/oppsummering');
});
