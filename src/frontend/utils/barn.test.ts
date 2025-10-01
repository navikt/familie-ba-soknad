import { DeepPartial } from 'ts-essentials';
import { vi } from 'vitest';
import * as vitestMockExtended from 'vitest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { genererOppdaterteBarn, genererSvarForSpørsmålBarn } from '../components/SøknadsSteg/OmBarnaDine/utils';
import { IBarnMedISøknad } from '../typer/barn';
import { AlternativtSvarForInput } from '../typer/common';
import { IOmBarnaDineFeltTyper } from '../typer/skjema';
import { ISøknad } from '../typer/søknad';

describe('genererSvarForSpørsmålBarn', () => {
    const mockBarn = vitestMockExtended.mockDeep<IBarnMedISøknad>({ id: 'random-id' });
    const mockFeltSomInkludererBarn = vitestMockExtended.mockDeep<Felt<string[]>>({
        verdi: ['random-id'],
    });
    const mockFeltSomIkkeInkludererBarn = vitestMockExtended.mockDeep<Felt<string[]>>({
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
    const mockSøknad = vitestMockExtended.mockDeep<ISøknad>({
        barnInkludertISøknaden: [
            {
                id: 'random-id',
                idNummer: [],
                utenlandsperioder: [],
                eøsBarnetrygdsperioder: [],
                institusjonsnavn: { svar: 'Narvesen' },
                institusjonsadresse: { svar: 'Narvesen' },
                institusjonspostnummer: { svar: '2020' },
                institusjonOppholdStartdato: { svar: '2020-09-08' },
                institusjonOppholdSluttdato: { svar: AlternativtSvarForInput.UKJENT },
                planleggerÅBoINorge12Mnd: { svar: ESvar.JA },
            },
        ],
    });

    const mockSkjema = vitestMockExtended.mockDeep<ISkjema<IOmBarnaDineFeltTyper, string>>({
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
        expect(genererOppdaterteBarn(mockSøknad, mockSkjema, _barn => false, vi.fn())).toEqual([
            expect.objectContaining<DeepPartial<IBarnMedISøknad>>({
                id: 'random-id',
                erFosterbarn: expect.objectContaining({ svar: 'JA' }),
                erAsylsøker: expect.objectContaining({ svar: 'JA' }),
                erAdoptertFraUtland: expect.objectContaining({ svar: 'NEI' }),
                oppholderSegIInstitusjon: expect.objectContaining({ svar: 'NEI' }),
                boddMindreEnn12MndINorge: expect.objectContaining({ svar: 'NEI' }),
                barnetrygdFraAnnetEøsland: expect.objectContaining({ svar: 'JA' }),
                institusjonsnavn: expect.objectContaining({ svar: '' }),
                institusjonsadresse: expect.objectContaining({ svar: '' }),
                institusjonspostnummer: expect.objectContaining({ svar: '' }),
                institusjonOppholdStartdato: expect.objectContaining({ svar: '' }),
                institusjonOppholdSluttdato: expect.objectContaining({ svar: '' }),
                planleggerÅBoINorge12Mnd: expect.objectContaining({ svar: null }),
            }),
        ]);
    });
});
