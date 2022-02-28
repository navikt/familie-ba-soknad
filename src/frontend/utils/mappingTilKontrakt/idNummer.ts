import { getName } from 'i18n-iso-countries';

import { LocaleType } from '@navikt/familie-sprakvelger';

import {
    EøsSøkerSpørsmålId,
    eøsSøkerSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Søker/spørsmål';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IIdNummerIKontraktFormat } from '../../typer/kontrakt/v7';
import { IIdNummer } from '../../typer/person';
import { hentTekster } from '../språk';
import { sammeVerdiAlleSpråk, sammeVerdiAlleSpråkEllerUkjentSpråktekst } from './hjelpefunksjoner';

export const idNummerTilISøknadsfelt = (
    idnummerObj: IIdNummer,
    valgtSpråk: LocaleType
): ISøknadsfelt<IIdNummerIKontraktFormat> => ({
    label: hentTekster(eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummer], {
        land: getName(idnummerObj.land, valgtSpråk),
    }),
    verdi: sammeVerdiAlleSpråk({
        idNummer: {
            label: hentTekster(eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummer], {
                land: getName(idnummerObj.land, valgtSpråk),
            }),
            verdi: sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                idnummerObj.idnummer,
                eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummerUkjent],
                {
                    land: getName(idnummerObj.land, valgtSpråk),
                }
            ),
        },
        land: {
            label: hentTekster(eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummer], {
                land: getName(idnummerObj.land, valgtSpråk),
            }),
            verdi: sammeVerdiAlleSpråk(idnummerObj.land),
        },
    }),
});
