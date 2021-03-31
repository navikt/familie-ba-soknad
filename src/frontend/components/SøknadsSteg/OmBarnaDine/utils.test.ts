// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// Disabler ts for å kunne sende inn parametre med kun nødvendige felter i objektet, uten å måtte mocke hele objektet.

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
    const mockSøknad = { barnInkludertISøknaden: [{ ident: '12345678910' }] };
    const mockSkjema = {
        felter: {
            hvemErFosterbarn: { verdi: ['12345678910'] },
            hvemErSøktAsylFor: { verdi: ['12345678910'] },
            hvemErAdoptertFraUtland: { verdi: [] },
            hvemOppholderSegIInstitusjon: { verdi: [] },
            hvemTolvMndSammenhengendeINorge: { verdi: [] },
            hvemOppholderSegIUtland: { verdi: ['12345678910'] },
            hvemBarnetrygdFraAnnetEøsland: { verdi: [] },
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
                oppholdtSegINorgeSammenhengendeTolvMnd: { svar: 'NEI' },
                oppholderSegIUtland: { svar: 'JA' },
                barnetrygdFraAnnetEøsland: { svar: 'NEI' },
            },
        ]);
    });
});
