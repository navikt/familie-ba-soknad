// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// Disabler ts for å kunne sende inn parametre med kun nødvendige felter i objektet, uten å måtte mocke hele objektet.

import {
    genererOppdaterteBarn,
    genererSvarForSpørsmålBarn,
    hentFiltrerteAvhengigheter,
} from './utils';

describe('hentFiltrerteAvhengigheter', () => {
    const mockJaNeiSpmOgCheckboxParSvarJa = [
        {
            jaNeiSpm: { verdi: 'JA', id: 'jaNeiId' },
            checkbox: { verdi: ['12345678910'], id: 'checkboxId' },
        },
    ];
    const mockJaNeiSpmOgCheckboxParSvarNei = [
        {
            jaNeiSpm: { verdi: 'NEI', id: 'jaNeiId' },
            checkbox: { verdi: ['12345678910'], id: 'checkboxId' },
        },
    ];
    const mockJaNeiSpmOgCheckboxParSvarUndefined = [
        {
            jaNeiSpm: { verdi: undefined, id: 'jaNeiId' },
            checkbox: { verdi: ['12345678910'], id: 'checkboxId' },
        },
    ];

    test('Returnerer checkbox dersom svar på jaNeiSpm === JA', () => {
        expect(hentFiltrerteAvhengigheter(mockJaNeiSpmOgCheckboxParSvarJa)).toEqual({
            [mockJaNeiSpmOgCheckboxParSvarJa[0].checkbox.id]:
                mockJaNeiSpmOgCheckboxParSvarJa[0].checkbox,
        });
    });
    test('Returnerer jaNeiSpm dersom svar på jaNeiSpm === NEI', () => {
        expect(hentFiltrerteAvhengigheter(mockJaNeiSpmOgCheckboxParSvarNei)).toEqual({
            [mockJaNeiSpmOgCheckboxParSvarNei[0].jaNeiSpm.id]:
                mockJaNeiSpmOgCheckboxParSvarNei[0].jaNeiSpm,
        });
    });
    test('Returnerer jaNeiSpm dersom svar på jaNeiSpm === undefined', () => {
        expect(hentFiltrerteAvhengigheter(mockJaNeiSpmOgCheckboxParSvarUndefined)).toEqual({
            [mockJaNeiSpmOgCheckboxParSvarUndefined[0].jaNeiSpm.id]:
                mockJaNeiSpmOgCheckboxParSvarUndefined[0].jaNeiSpm,
        });
    });
});

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
