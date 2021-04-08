import { Alpha3Code } from 'i18n-iso-countries';
import { mock } from 'jest-mock-extended';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, Valideringsstatus } from '@navikt/familie-skjema';

import { erRelevanteAvhengigheterValidert } from './useJaNeiSpmFelt';

describe('erRelevanteAvhengigheterValidert', () => {
    test('Skal returnere true dersom alle felter er validert til OK', () => {
        const værtINorgeITolvMånederFeltMock = mock<Felt<ESvar | undefined>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholderSegINorgeFeltMock = mock<Felt<ESvar | undefined>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholdslandFeltMock = mock<Felt<Alpha3Code | undefined>>({
            valideringsstatus: Valideringsstatus.OK,
            erSynlig: true,
        });
        const oppholdslandDatoFeltMock = mock<Felt<ISODateString>>({
            valideringsstatus: Valideringsstatus.OK,
            erSynlig: true,
        });

        const avhengigheterMock = {
            oppholderSegINorge: {
                jaNeiSpm: oppholderSegINorgeFeltMock,
                tilhørendeFelter: [oppholdslandFeltMock, oppholdslandDatoFeltMock],
            },
            værtINorgeITolvMånederFeltMock: {
                jaNeiSpm: værtINorgeITolvMånederFeltMock,
            },
        };
        expect(erRelevanteAvhengigheterValidert(avhengigheterMock)).toEqual(true);
    });

    test('Skal returnere false dersom tilhørende og relevant felt ikke er validert OK', () => {
        const værtINorgeITolvMånederFeltMock = mock<Felt<ESvar | undefined>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholderSegINorgeFeltMock = mock<Felt<ESvar | undefined>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholdslandFeltMock = mock<Felt<Alpha3Code | undefined>>({
            valideringsstatus: Valideringsstatus.OK,
            erSynlig: true,
        });
        const oppholdslandDatoFeltMock = mock<Felt<ISODateString>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
            erSynlig: true,
        });

        const avhengigheterMock = {
            oppholderSegINorge: {
                jaNeiSpm: oppholderSegINorgeFeltMock,
                tilhørendeFelter: [oppholdslandFeltMock, oppholdslandDatoFeltMock],
            },
            værtINorgeITolvMånederFeltMock: {
                jaNeiSpm: værtINorgeITolvMånederFeltMock,
            },
        };
        expect(erRelevanteAvhengigheterValidert(avhengigheterMock)).toEqual(false);
    });

    test('Skal returnere false dersom et avhengig JaNeiSpm med tilhørende felter ikke er validert til OK', () => {
        const værtINorgeITolvMånederFeltMock = mock<Felt<ESvar | undefined>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholderSegINorgeFeltMock = mock<Felt<ESvar | undefined>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
        });
        const oppholdslandFeltMock = mock<Felt<Alpha3Code | undefined>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
            erSynlig: false,
        });
        const oppholdslandDatoFeltMock = mock<Felt<ISODateString>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
            erSynlig: false,
        });

        const avhengigheterMock = {
            oppholderSegINorge: {
                jaNeiSpm: oppholderSegINorgeFeltMock,
                tilhørendeFelter: [oppholdslandFeltMock, oppholdslandDatoFeltMock],
            },
            værtINorgeITolvMånederFeltMock: {
                jaNeiSpm: værtINorgeITolvMånederFeltMock,
            },
        };
        expect(erRelevanteAvhengigheterValidert(avhengigheterMock)).toEqual(false);
    });

    test('Skal returnere false dersom et avhengig JaNeiSpm ikke er validert til OK', () => {
        const værtINorgeITolvMånederFeltMock = mock<Felt<ESvar | undefined>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
        });
        const oppholderSegINorgeFeltMock = mock<Felt<ESvar | undefined>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholdslandFeltMock = mock<Felt<Alpha3Code | undefined>>({
            valideringsstatus: Valideringsstatus.OK,
            erSynlig: false,
        });
        const oppholdslandDatoFeltMock = mock<Felt<ISODateString>>({
            valideringsstatus: Valideringsstatus.OK,
            erSynlig: false,
        });

        const avhengigheterMock = {
            oppholderSegINorge: {
                jaNeiSpm: oppholderSegINorgeFeltMock,
                tilhørendeFelter: [oppholdslandFeltMock, oppholdslandDatoFeltMock],
            },
            værtINorgeITolvMånederFeltMock: {
                jaNeiSpm: værtINorgeITolvMånederFeltMock,
            },
        };
        expect(erRelevanteAvhengigheterValidert(avhengigheterMock)).toEqual(false);
    });
});
