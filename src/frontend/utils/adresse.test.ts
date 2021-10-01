import { IAdresse } from '../typer/person';
import { hentAdressefelterSortert, regexNorskEllerUtenlandskPostnummer } from './adresse';

describe('postnummer', () => {
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

describe('Adresse', () => {
    test('Kan rendre standard adresse', () => {
        const adresse: IAdresse = {
            adressenavn: 'Testgata',
            husbokstav: 'C',
            husnummer: '1',
            postnummer: '1263',
        };

        const result = hentAdressefelterSortert(adresse);
        expect(result).toEqual(['Testgata 1C', '1263']);
    });

    test('Kan rendre rar adresse', () => {
        const adresse: IAdresse = {
            adressenavn: 'Bestemorenga',
            postnummer: '8020',
            poststed: 'Bodø',
        };

        const result = hentAdressefelterSortert(adresse);
        expect(result).toEqual(['Bestemorenga', '8020 Bodø']);
    });
});
