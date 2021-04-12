import { ISODateString } from '@navikt/familie-form-elements';

import { ESivilstand, IAdresse } from '../typer/person';
import {
    hentAdressefelterSortert,
    hentSivilstatus,
    landkodeTilSpråk,
    fødselsdatoSomISOStringFraIdNummer,
} from './person';

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
        // eslint-disable-next-line
        // @ts-ignore fordi hele poenget er at det er en ukjent verdi
        expect(hentSivilstatus('JEGHARKJÆRESTE')).toEqual('sivilstatus.kode.ANNET');
    });

    test('Skal returnere tekstid til innsendt sivilstatus kode', () => {
        expect(hentSivilstatus(ESivilstand.GIFT)).toEqual(`sivilstatus.kode.${ESivilstand.GIFT}`);
    });
});

describe('fødselsdatoSomISOStringFraIdNummer', () => {
    test(`Strippper vekk tabs og spaces og funker uten spacing`, () => {
        expect(fødselsdatoSomISOStringFraIdNummer('01010112345')).toEqual('2001-01-01');
        expect(fødselsdatoSomISOStringFraIdNummer('010101 12345')).toEqual('2001-01-01');
        expect(fødselsdatoSomISOStringFraIdNummer('010101   12345')).toEqual('2001-01-01');
    });

    test(`Mapper korrekt datoene i dokumentasjonen`, () => {
        const forventaVerdier: Record<string, ISODateString> = {
            '010120 12345': '2020-01-01',
            '010140 12345': '2040-01-01',
            '010160 12345': '1960-01-01',
            '010180 12345': '1980-01-01',
        };

        Object.entries(forventaVerdier).forEach(entry => {
            const [idnummer, dato] = entry;
            expect(fødselsdatoSomISOStringFraIdNummer(idnummer)).toEqual(dato);
        });
    });

    test(`Mapper korrekt datoene i dokumentasjonen hvis de er d-nummere`, () => {
        const forventaVerdier: Record<string, ISODateString> = {
            '410120 12345': '2020-01-01',
            '410140 12345': '2040-01-01',
            '410160 12345': '1960-01-01',
            '410180 12345': '1980-01-01',
        };

        Object.entries(forventaVerdier).forEach(entry => {
            const [idnummer, dato] = entry;
            expect(fødselsdatoSomISOStringFraIdNummer(idnummer)).toEqual(dato);
        });
    });

    test(`Regresjonstester`, () => {
        const harGittFeilFør: Record<string, ISODateString> = {
            '13041550095': '2015-04-13',
            '16101176499': '2011-10-16',
            '16101176650': '2011-10-16',
        };

        Object.entries(harGittFeilFør).forEach(entry => {
            const [idnummer, dato] = entry;
            expect(fødselsdatoSomISOStringFraIdNummer(idnummer)).toEqual(dato);
        });
    });
});
