import { mockDeep } from 'jest-mock-extended';
import { DeepPartial } from 'ts-essentials';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../typer/barn';
import { AlternativtSvarForInput } from '../typer/common';
import { IOmBarnaDineFeltTyper } from '../typer/skjema';
import { ISøknad } from '../typer/søknad';
import { genererOppdaterteBarn, genererSvarForSpørsmålBarn } from './barn';

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
        expect(genererOppdaterteBarn(mockSøknad, mockSkjema, _barn => false)).toEqual([
            objectContaining<DeepPartial<IBarnMedISøknad>>({
                id: 'random-id',
                erFosterbarn: objectContaining({ svar: 'JA' }),
                erAsylsøker: objectContaining({ svar: 'JA' }),
                erAdoptertFraUtland: objectContaining({ svar: 'NEI' }),
                oppholderSegIInstitusjon: objectContaining({ svar: 'NEI' }),
                boddMindreEnn12MndINorge: objectContaining({ svar: 'NEI' }),
                barnetrygdFraAnnetEøsland: objectContaining({ svar: 'JA' }),
                institusjonsnavn: objectContaining({ svar: '' }),
                institusjonsadresse: objectContaining({ svar: '' }),
                institusjonspostnummer: objectContaining({ svar: '' }),
                institusjonOppholdStartdato: objectContaining({ svar: '' }),
                institusjonOppholdSluttdato: objectContaining({ svar: '' }),
                planleggerÅBoINorge12Mnd: objectContaining({ svar: null }),
                barnetrygdFraEøslandHvilketLand: objectContaining({ svar: 'AUS' }),
            }),
        ]);
    });
});
