import { regexNorskEllerUtenlandskPostnummer } from './utils';

describe('hjelpefunksjoner', () => {
    test('Skal returnere true for gyldige postnummer', () => {
        expect(regexNorskEllerUtenlandskPostnummer('1234')).toEqual(
            expect.arrayContaining(['1234'])
        );
        expect(regexNorskEllerUtenlandskPostnummer('ABc')).toEqual(expect.arrayContaining(['ABc']));
        expect(regexNorskEllerUtenlandskPostnummer('XXX-XXX')).toEqual(
            expect.arrayContaining(['XXX-XXX'])
        );
        expect(regexNorskEllerUtenlandskPostnummer('12-Æøå')).toEqual(
            expect.arrayContaining(['12-Æøå'])
        );
    });

    test('Skal returnere false for ugyldige postnummer', () => {
        expect(regexNorskEllerUtenlandskPostnummer('12')).toEqual(null);
        expect(regexNorskEllerUtenlandskPostnummer('AB12345678919')).toEqual(null);
        expect(regexNorskEllerUtenlandskPostnummer('XXX/()>')).toEqual(null);
    });
});
