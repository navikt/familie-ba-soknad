import { IAdresse } from '../typer/person';
import { hentAdressefelterSortert } from './person';

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
        bostedskommune: 'Bodø',
    };

    const result = hentAdressefelterSortert(adresse);
    expect(result).toEqual(['Bestemorenga', '8020 Bodø']);
});
