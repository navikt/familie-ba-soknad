import { mockDeep } from 'jest-mock-extended';
import { DeepPartial } from 'ts-essentials';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { AlternativtSvarForInput, IBarnMedISøknad } from '../../../typer/person';
import { ISøknad } from '../../../typer/søknad';
import { IOmBarnaDineFeltTyper } from './useOmBarnaDine';
import { genererOppdaterteBarn, genererSvarForSpørsmålBarn } from './utils';

describe('genererSvarForSpørsmålBarn', () => {
    const mockBarn = mockDeep<IBarnMedISøknad>({ id: 'random-id' });
    const mockFeltSomInkludererBarn = mockDeep<Felt<string[]>>({ verdi: ['random-id'] });
    const mockFeltSomIkkeInkludererBarn = mockDeep<Felt<string[]>>({
        verdi: ['random-id-1', 'random-id-2'],
    });

    test('Returner JA dersom barn er inkludert i feltets verdi (array)', () => {
        expect(genererSvarForSpørsmålBarn(mockBarn, mockFeltSomInkludererBarn)).toEqual('JA');
    });
    test('Returner NEI dersom barn ikke er inkludert i feltets verdi (array)', () => {
        expect(genererSvarForSpørsmålBarn(mockBarn, mockFeltSomIkkeInkludererBarn)).toEqual('NEI');
    });
});

describe('genererOppdaterteBarn', () => {
    const { objectContaining } = expect;
    const mockSøknad = mockDeep<ISøknad>({
        barnInkludertISøknaden: [
            {
                id: 'random-id',
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
    });

    const mockSkjema = mockDeep<ISkjema<IOmBarnaDineFeltTyper, string>>({
        felter: {
            hvemErFosterbarn: { verdi: ['random-id'] },
            hvemErSøktAsylFor: { verdi: ['random-id'] },
            hvemErAdoptertFraUtland: { verdi: [] },
            hvemOppholderSegIInstitusjon: { verdi: [] },
            hvemTolvMndSammenhengendeINorge: { verdi: [] },
            hvemOppholderSegIUtland: { verdi: ['random-id'] },
            hvemBarnetrygdFraAnnetEøsland: { verdi: ['random-id'] },
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
    });

    test('Returner objekt med barn, med forventede verdier', () => {
        expect(genererOppdaterteBarn(mockSøknad, mockSkjema)).toEqual([
            objectContaining<DeepPartial<IBarnMedISøknad>>({
                id: 'random-id',
                erFosterbarn: objectContaining({ svar: 'JA' }),
                erAsylsøker: objectContaining({ svar: 'JA' }),
                erAdoptertFraUtland: objectContaining({ svar: 'NEI' }),
                oppholderSegIInstitusjon: objectContaining({ svar: 'NEI' }),
                boddMindreEnn12MndINorge: objectContaining({ svar: 'NEI' }),
                oppholderSegIUtland: objectContaining({ svar: 'JA' }),
                barnetrygdFraAnnetEøsland: objectContaining({ svar: 'JA' }),
                institusjonsnavn: objectContaining({ svar: '' }),
                institusjonsadresse: objectContaining({ svar: '' }),
                institusjonspostnummer: objectContaining({ svar: '' }),
                institusjonOppholdStartdato: objectContaining({ svar: '' }),
                institusjonOppholdSluttdato: objectContaining({ svar: '' }),
                oppholdsland: objectContaining({ svar: 'AUS' }),
                oppholdslandStartdato: objectContaining({ svar: '2020-08-08' }),
                oppholdslandSluttdato: objectContaining({ svar: AlternativtSvarForInput.UKJENT }),
                nårKomBarnTilNorgeDato: objectContaining({ svar: '' }),
                planleggerÅBoINorge12Mnd: objectContaining({ svar: null }),
                barnetrygdFraEøslandHvilketLand: objectContaining({ svar: 'AUS' }),
            }),
        ]);
    });
});
