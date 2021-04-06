// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// Disabler ts for å kunne sende inn parametre med kun nødvendige felter i objektet, uten å måtte mocke hele objektet.

import { ESvar } from '@navikt/familie-form-elements';

import { hentFiltrerteAvhengigheter } from './felthook';

describe('hentFiltrerteAvhengigheter', () => {
    const mockJaNeiSpmMedCheckboxSvarJa = [
        {
            jaNeiSpm: { verdi: 'JA', id: 'jaNeiId' },
            tilhørendeFelter: [{ verdi: ['12345678910'], id: 'checkboxId' }],
        },
    ];
    const mockJaNeiSpmMedCheckboxSvarNei = [
        {
            jaNeiSpm: { verdi: 'NEI', id: 'jaNeiId' },
            tilhørendeFelter: [{ verdi: ['12345678910'], id: 'checkboxId' }],
        },
    ];
    const mockJaNeiSpmMedCheckboxSvarUndefined = [
        {
            jaNeiSpm: { verdi: undefined, id: 'jaNeiId' },
            tilhørendeFelter: [{ verdi: ['12345678910'], id: 'checkboxId' }],
        },
    ];

    test('Returnerer checkbox dersom svar på jaNeiSpm === JA', () => {
        expect(hentFiltrerteAvhengigheter(mockJaNeiSpmMedCheckboxSvarJa, ESvar.JA)).toEqual({
            checkboxId: { verdi: ['12345678910'], id: 'checkboxId' },
        });
    });
    test('Returnerer jaNeiSpm dersom svar på jaNeiSpm === NEI', () => {
        expect(hentFiltrerteAvhengigheter(mockJaNeiSpmMedCheckboxSvarNei, ESvar.JA)).toEqual({
            jaNeiId: { verdi: 'NEI', id: 'jaNeiId' },
        });
    });
    test('Returnerer jaNeiSpm dersom svar på jaNeiSpm === undefined', () => {
        expect(hentFiltrerteAvhengigheter(mockJaNeiSpmMedCheckboxSvarUndefined, ESvar.JA)).toEqual({
            jaNeiId: { verdi: undefined, id: 'jaNeiId' },
        });
    });
});
