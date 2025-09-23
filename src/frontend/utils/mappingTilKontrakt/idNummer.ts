import { getName } from 'i18n-iso-countries';

import { LocaleType } from '../../typer/common';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IIdNummerIKontraktFormat } from '../../typer/kontrakt/kontrakt';
import { IIdNummer } from '../../typer/person';
import { hentTekster } from '../språk';

import { sammeVerdiAlleSpråk, sammeVerdiAlleSpråkEllerUkjentSpråktekst } from './hjelpefunksjoner';

export const idNummerTilISøknadsfelt = (
    idnummerObj: IIdNummer,
    spørsmålSpråkId: string,
    ukjentSvarSpråkId: string,
    valgtSpråk: LocaleType,
    barnetsNavn?: string
): ISøknadsfelt<IIdNummerIKontraktFormat> => ({
    label: hentTekster(spørsmålSpråkId, {
        land: getName(idnummerObj.land, valgtSpråk),
        ...(barnetsNavn && { barn: barnetsNavn }),
    }),
    verdi: sammeVerdiAlleSpråk({
        idNummer: {
            label: hentTekster(spørsmålSpråkId, {
                land: getName(idnummerObj.land, valgtSpråk),
                ...(barnetsNavn && { barn: barnetsNavn }),
            }),
            verdi: sammeVerdiAlleSpråkEllerUkjentSpråktekst(idnummerObj.idnummer, ukjentSvarSpråkId, {
                land: getName(idnummerObj.land, valgtSpråk),
            }),
        },
        land: {
            label: hentTekster(spørsmålSpråkId, {
                land: getName(idnummerObj.land, valgtSpråk),
                ...(barnetsNavn && { barn: barnetsNavn }),
            }),
            verdi: sammeVerdiAlleSpråk(idnummerObj.land),
        },
    }),
});
