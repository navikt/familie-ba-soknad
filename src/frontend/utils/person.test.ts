import { ESivilstand, IAdresse } from '../typer/person';
import { hentAdressefelterSortert, hentSivilstatus, landkodeTilSpråk } from './person';

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

describe('landkodeTilSpråk', () => {
    test('Kan ta inn landkode og gjøre om til språk', () => {
        expect(landkodeTilSpråk('NOR', 'nb')).toEqual('Norge');
    });
});

describe('hentSivilstatus', () => {
    test('Skal returnere tekstid til sivilstatus kode ANNET dersom sivilstanden er ukjent', () => {
        expect(hentSivilstatus('JEGHARKJÆRESTE')).toEqual('sivilstatus.kode.ANNET');
    });

    test('Skal returnere tekstid til innsendt sivilstatus kode', () => {
        expect(hentSivilstatus(ESivilstand.GIFT)).toEqual(`sivilstatus.kode.${ESivilstand.GIFT}`);
    });
});
