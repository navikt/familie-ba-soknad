import { erDatoFormatGodkjent } from './useDatovelgerFelt';

describe('erDatoFormatGodkjent', () => {
    test('Skal returnere false dersom dato ikke er gyldig', () => {
        expect(erDatoFormatGodkjent('2008-14-02')).toEqual(false);
    });

    test('Skal returnere false dersom dato er på feil format', () => {
        expect(erDatoFormatGodkjent('02-14-2008')).toEqual(false);
    });

    test('Skal returnere false dersom dato er en tekst', () => {
        expect(erDatoFormatGodkjent('jegerendato')).toEqual(false);
    });

    test('Skal returnere false dersom dato er tall på feil format', () => {
        expect(erDatoFormatGodkjent('22293')).toEqual(false);
    });

    test('Skal returnere true dersom dato er på riktig format og gyldig', () => {
        expect(erDatoFormatGodkjent('2008-12-02')).toEqual(true);
    });
});
