// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// Disabler ts for å kunne sende inn parametre med kun nødvendige felter i objektet, uten å måtte mocke hele objektet.

import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput } from '../../../typer/person';
import { genererOppdaterteBarn, genererSvarForSpørsmålBarn } from './utils';

describe('genererSvarForSpørsmålBarn', () => {
    const mockBarn = { ident: '12345678910' };
    const mockFeltSomInkludererBarn = { verdi: ['12345678910'] };
    const mockFeltSomIkkeInkludererBarn = { verdi: ['12345678911', '12345678912'] };

    test('Returner JA dersom barn er inkludert i feltets verdi (array)', () => {
        expect(genererSvarForSpørsmålBarn(mockBarn, mockFeltSomInkludererBarn)).toEqual('JA');
    });
    test('Returner NEI dersom barn ikke er inkludert i feltets verdi (array)', () => {
        expect(genererSvarForSpørsmålBarn(mockBarn, mockFeltSomIkkeInkludererBarn)).toEqual('NEI');
    });
});

describe('genererOppdaterteBarn', () => {
    const mockSøknad = {
        barnInkludertISøknaden: [
            {
                ident: '12345678910',
                institusjonsnavn: { svar: 'Narvesen' },
                institusjonsadresse: { svar: 'Narvesen' },
                institusjonspostnummer: { svar: '2020' },
                institusjonOppholdStartdato: { svar: '2020-09-08' },
                institusjonOppholdSluttdato: { svar: AlternativtSvarForInput.UKJENT },
                oppholdsland: { svar: 'AUS' },
                oppholdslandStartdato: { svar: '2020-08-08' },
                oppholdslandSluttdato: { svar: AlternativtSvarForInput.UKJENT },
                nårKomBarnTilNorgeDato: { svar: '2020-07-07' },
                planleggerÅBoINorge12Mnd: { svar: ESvar.JA },
                barnetrygdFraEøslandHvilketLand: { svar: 'AUS' },
            },
        ],
    };
    const mockSkjema = {
        felter: {
            hvemErFosterbarn: { verdi: ['12345678910'] },
            hvemErSøktAsylFor: { verdi: ['12345678910'] },
            hvemErAdoptertFraUtland: { verdi: [] },
            hvemOppholderSegIInstitusjon: { verdi: [] },
            hvemTolvMndSammenhengendeINorge: { verdi: [] },
            hvemOppholderSegIUtland: { verdi: ['12345678910'] },
            hvemBarnetrygdFraAnnetEøsland: { verdi: ['12345678910'] },
            erNoenAvBarnaFosterbarn: {
                verdi: ESvar.JA,
            },
            oppholderBarnSegIInstitusjon: {
                verdi: ESvar.NEI,
            },
            erBarnAdoptertFraUtland: {
                verdi: ESvar.NEI,
            },
            oppholderBarnSegIUtland: {
                verdi: ESvar.JA,
            },
            søktAsylForBarn: {
                verdi: ESvar.JA,
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                verdi: ESvar.NEI,
            },
            mottarBarnetrygdForBarnFraAnnetEøsland: {
                verdi: ESvar.JA,
            },
        },
    };

    test('Returner objekt med barn, med forventede verdier', () => {
        expect(genererOppdaterteBarn(mockSøknad, mockSkjema)).toEqual([
            {
                ident: '12345678910',
                erFosterbarn: { svar: 'JA' },
                erAsylsøker: { svar: 'JA' },
                erAdoptertFraUtland: { svar: 'NEI' },
                oppholderSegIInstitusjon: { svar: 'NEI' },
                boddMindreEnn12MndINorge: { svar: 'NEI' },
                oppholderSegIUtland: { svar: 'JA' },
                barnetrygdFraAnnetEøsland: { svar: 'JA' },
                institusjonsnavn: { svar: '' },
                institusjonsadresse: { svar: '' },
                institusjonspostnummer: { svar: '' },
                institusjonOppholdStartdato: { svar: '' },
                institusjonOppholdSluttdato: { svar: '' },
                oppholdsland: { svar: 'AUS' },
                oppholdslandStartdato: { svar: '2020-08-08' },
                oppholdslandSluttdato: { svar: AlternativtSvarForInput.UKJENT },
                nårKomBarnTilNorgeDato: { svar: '' },
                planleggerÅBoINorge12Mnd: { svar: undefined },
                barnetrygdFraEøslandHvilketLand: { svar: 'AUS' },
            },
        ]);
    });
});
