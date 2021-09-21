import { regexUtenlandskPostnummer } from './utils';

describe('hjelpefunksjoner', () => {
    test('Skal returnere true for gyldige postnummer', () => {
        expect(regexUtenlandskPostnummer('1234')).toEqual(expect.arrayContaining(['1234']));
        expect(regexUtenlandskPostnummer('ABc')).toEqual(expect.arrayContaining(['ABc']));
        expect(regexUtenlandskPostnummer('XXX-XXX')).toEqual(expect.arrayContaining(['XXX-XXX']));
        expect(regexUtenlandskPostnummer('12-Æøå')).toEqual(expect.arrayContaining(['12-Æøå']));
    });

    test('Skal returnere false for ugyldige postnummer', () => {
        expect(regexUtenlandskPostnummer('12')).toEqual(null);
        expect(regexUtenlandskPostnummer('AB12345678919')).toEqual(null);
        expect(regexUtenlandskPostnummer('XXX/()>')).toEqual(null);
    });
});
